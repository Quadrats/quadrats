import { readFileAsDataURL } from '@quadrats/utils';
import {
  createParagraphElement,
  Element,
  QuadratsElement,
  Editor,
  HistoryEditor,
  isAboveBlockEmpty,
  Transforms,
  Path,
} from '@quadrats/core';
import { FileUploader, FileUploaderElement, UploaderPlaceholderElement } from './typings';
import { FILE_UPLOADER_TYPE, FILE_UPLOADER_PLACEHOLDER_TYPE } from './constants';
import { getFilesFromInput } from './getFilesFromInput';
import { TABLE_CELL_TYPE } from '@quadrats/common/table';

export interface CreateFileUploaderOptions {
  type?: string;
}

export const createFileUploaderElementByType: (type: string) => FileUploader<Editor>['createFileUploaderElement'] =
  (type) => async (editor, file, options) => {
    const { createElement, getBody, getHeaders, getUrl, uploader } = options;

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

export function insertFileUploaderElement(editor: Editor, fileUploaderElement: FileUploaderElement | undefined) {
  if (fileUploaderElement) {
    // 驗證當前 selection 是否仍然有效
    if (!editor.selection) {
      return;
    }

    try {
      // 嘗試取得當前選取位置的節點，確保路徑仍然有效
      const node = Editor.node(editor, editor.selection);

      if (!node) {
        return;
      }
    } catch (error) {
      // 如果路徑無效（例如 placeholder 已被移除），靜默失敗
      console.warn('Cannot insert file uploader element: invalid selection path', error);

      return;
    }

    const [currentBlockEntry] = Editor.nodes(editor, {
      match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
    });

    if (currentBlockEntry) {
      const [, currentPath] = currentBlockEntry;

      // 在目前 block 後面插入
      const insertPath = Path.next(currentPath);

      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, [fileUploaderElement, createParagraphElement()], {
          at: insertPath,
        });
      });
    } else {
      // 沒找到 block（例如空編輯器）
      Editor.withoutNormalizing(editor, () => {
        Transforms.insertNodes(editor, [fileUploaderElement, createParagraphElement()]);
      });
    }

    // Clear empty node
    if (isAboveBlockEmpty(editor)) {
      Transforms.removeNodes(editor, {
        at: editor.selection.anchor,
      });
    }

    Transforms.move(editor);
  }
}

export function createFileUploader(options: CreateFileUploaderOptions = {}): FileUploader<Editor> {
  const { type = FILE_UPLOADER_TYPE } = options;
  const createFileUploaderElement: FileUploader<Editor>['createFileUploaderElement'] =
    createFileUploaderElementByType(type);

  const removeUploaderPlaceholder: FileUploader<Editor>['removeUploaderPlaceholder'] = (editor) => {
    const matches = Array.from(
      Editor.nodes(editor, {
        at: [],
        match: (node) => Element.isElement(node) && (node as QuadratsElement).type === FILE_UPLOADER_PLACEHOLDER_TYPE,
      }),
    );

    if (matches.length) {
      matches
        .map(([, path]) => path)

        .forEach((path) => {
          Transforms.removeNodes(editor, { at: path });
        });
    }
  };

  const upload: FileUploader<Editor>['upload'] = async (editor, options) => {
    // 檢查是否在不允許的元件之中，如果是則不執行上傳
    if (editor.selection) {
      try {
        const invalidEntry = Editor.above(editor, {
          at: editor.selection,
          match: (n) => Element.isElement(n) && (n as QuadratsElement).type === TABLE_CELL_TYPE,
        });

        if (invalidEntry) return;
      } catch (error) {
        return;
      }
    }

    const { accept, multiple } = options;
    const files = await getFilesFromInput({ accept, multiple });

    if (!files) {
      removeUploaderPlaceholder(editor);

      return;
    }

    removeUploaderPlaceholder(editor);

    files.reduce(async (prev, file) => {
      await prev;

      return createFileUploaderElement(editor, file, options).then((fileUploaderElement) => {
        insertFileUploaderElement(editor, fileUploaderElement);
      });
    }, Promise.resolve());
  };

  const insertUploaderPlaceholder: FileUploader<Editor>['insertUploaderPlaceholder'] = (editor) => {
    // 檢查是否在不允許的元件之中，如果是則不插入 placeholder
    if (editor.selection) {
      try {
        const invalidEntry = Editor.above(editor, {
          at: editor.selection,
          match: (n) => Element.isElement(n) && (n as QuadratsElement).type === TABLE_CELL_TYPE,
        });

        if (invalidEntry) return;
      } catch (error) {
        return;
      }
    }

    const uploaderPlaceholderElement: UploaderPlaceholderElement = {
      type: FILE_UPLOADER_PLACEHOLDER_TYPE,
      children: [{ text: '' }],
    };

    Editor.withoutNormalizing(editor, () => {
      Transforms.insertNodes(editor, uploaderPlaceholderElement);
    });
  };

  return {
    type,
    createFileUploaderElement,
    upload,
    insertUploaderPlaceholder,
    removeUploaderPlaceholder,
    with(editor) {
      return editor;
    },
  };
}
