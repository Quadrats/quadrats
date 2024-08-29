import { readFileAsDataURL } from '@quadrats/utils';
import { createParagraphElement, Editor, HistoryEditor, isAboveBlockEmpty, Transforms } from '@quadrats/core';
import { FileUploader, FileUploaderElement } from './typings';
import { FILE_UPLOADER_TYPE } from './constants';
import { getFilesFromInput } from './getFilesFromInput';

export interface CreateFileUploaderOptions {
  type?: string;
}

export function createFileUploader(options: CreateFileUploaderOptions = {}): FileUploader<Editor> {
  const { type = FILE_UPLOADER_TYPE } = options;
  const createFileUploaderElement: FileUploader<Editor>['createFileUploaderElement'] = async (
    editor,
    file,
    options,
  ) => {
    const {
      createElement, getBody, getHeaders, getUrl, uploader,
    } = options;

    const [mime] = file.type.split('/');
    const createByMime = createElement[mime];

    if (!createByMime) {
      return;
    }

    const { dataURL: createElementByDataURL, response: createElementByResponse } = createByMime;

    const headers = await getHeaders?.(file);
    const xhr = uploader || new XMLHttpRequest();
    const dataURL = await readFileAsDataURL(file);

    let sent = false;

    const fileUploaderElement: FileUploaderElement = {
      type,
      register: (getPath, onProgress) => {
        xhr.onload = () => {
          if (xhr.status < 400) {
            const path = getPath();

            if (path) {
              HistoryEditor.withoutSaving(editor as HistoryEditor, () => {
                Transforms.removeNodes(editor, { at: path });
                Transforms.insertNodes(editor, createElementByResponse(xhr.response), { at: path });
              });
            }
          } else {
            throw xhr.response;
          }
        };

        xhr.upload.onprogress = ({ loaded, total }: { loaded: number; total: number }) =>
          onProgress((loaded * 100) / total);

        if (!sent) {
          sent = true;
          xhr.send(getBody(file) as XMLHttpRequestBodyInit);
        }

        return () => {
          xhr.onload = null;
          xhr.upload.onprogress = null;
        };
      },
      children: [createElementByDataURL(dataURL)],
    };

    xhr.open('POST', getUrl(file));

    if (headers) {
      for (const headerName in headers) {
        xhr.setRequestHeader(headerName, headers[headerName]);
      }
    }

    return fileUploaderElement;
  };

  const upload: FileUploader<Editor>['upload'] = async (editor, options) => {
    const { accept, multiple } = options;
    const files = await getFilesFromInput({ accept, multiple });

    if (!files) {
      return;
    }

    files.reduce(async (prev, file) => {
      await prev;

      return createFileUploaderElement(editor, file, options).then((fileUploaderElement) => {
        if (fileUploaderElement) {
          // Clear empty node
          if (isAboveBlockEmpty(editor)) {
            Transforms.removeNodes(editor, {
              at: editor.selection?.anchor,
            });
          }

          Transforms.insertNodes(editor, [fileUploaderElement, createParagraphElement()], {
            at: editor.selection?.anchor.path.length ? [editor.selection?.anchor.path[0] + 1] : undefined,
          });

          Transforms.move(editor);
        }
      });
    }, Promise.resolve());
  };

  return {
    type,
    createFileUploaderElement,
    upload,
    with(editor) {
      return editor;
    },
  };
}
