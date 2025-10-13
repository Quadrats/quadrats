import { JSX } from 'react';
import isHotkey from 'is-hotkey';
import { readFileAsDataURL } from '@quadrats/utils';
import { Transforms } from '@quadrats/core';
import {
  createImage,
  CreateImageOptions,
  getImageElementCommonProps,
  getImageFigureElementCommonProps,
  Image,
  ImageElement,
  ImageFigureElement,
} from '@quadrats/common/image';
import {
  FILE_UPLOADER_TYPE,
  FileUploaderUploadOptions,
  createFileUploaderElementByType,
  insertFileUploaderElement,
} from '@quadrats/common/file-uploader';
import { createRenderElements, QuadratsReactEditor, RenderElementProps } from '@quadrats/react';
import { ReactImage } from './typings';
import { defaultRenderImageElements } from './defaultRenderImageElements';

export type CreateReactImageOptions<Hosting extends string> = CreateImageOptions<Hosting>;

export function createReactImage<Hosting extends string>(
  options: CreateReactImageOptions<Hosting> = {},
  getUploadOptions?: (image: Image<Hosting, QuadratsReactEditor>) => FileUploaderUploadOptions & {
    type?: string;
  },
): ReactImage<Hosting> {
  const core = createImage(options);
  const uploadOptions = getUploadOptions?.(core);

  const { types } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown(event, editor, next) {
        if ((event.key === 'Backspace' || event.key === 'Delete') && core.isCollapsedOnImage(editor)) {
          const [, figurePath] = core.getAboveImageFigure(editor) || [];

          if (figurePath) {
            Transforms.removeNodes(editor, { at: figurePath });

            return;
          }
        }

        const [, captionPath] = core.getAboveImageCaption(editor) || [];

        if (captionPath) {
          /**
           * Override original behavior of select all.
           * Only select the text in image caption if current selection is in image caption.
           */
          if (isHotkey('mod+a', event as any)) {
            event.preventDefault();
            Transforms.select(editor, captionPath);

            return;
          }
        }

        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderFigure = options.figure || defaultRenderImageElements.figure;
      const renderImage = options.image || defaultRenderImageElements.image;
      const renderCaption = options.caption || defaultRenderImageElements.caption;

      return createRenderElements([
        {
          type: types.figure,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<ImageFigureElement>;

            return renderFigure({
              ...getImageFigureElementCommonProps(element),
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.image,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<ImageElement>;

            return renderImage({
              ...getImageElementCommonProps(element, core.hostingResolvers),
              attributes,
              element,
              children,
              resizeImage: core.resizeImage,
            });
          },
        },
        {
          type: types.caption,
          render: renderCaption as (props: RenderElementProps) => JSX.Element,
        },
      ]);
    },
    with(editor) {
      const { insertData } = editor;

      editor.insertData = (data) => {
        const text = data.getData('text');
        const { files } = data;

        /**
         * Insert image if inserted text is image url.
         */
        if (text) {
          if (core.isImageUrl(text)) {
            core.insertImage(editor, text);

            return;
          }
        }

        /**
         * Insert each image which is image.
         */
        if (files.length) {
          /**
           * Insert each image when upload options are set.
           */
          if (uploadOptions) {
            const createFileUploaderElement = createFileUploaderElementByType(uploadOptions.type ?? FILE_UPLOADER_TYPE);

            Array.from(files).reduce(async (prev, file) => {
              await prev;

              return createFileUploaderElement(editor, file, uploadOptions).then((fileUploaderElement) => {
                insertFileUploaderElement(editor, fileUploaderElement);
              });
            }, Promise.resolve());

            return;
          }

          [...files]
            .filter((file) => {
              const [mime] = file.type.split('/');

              return mime === 'image';
            })
            .reduce(async (prev, imageFile) => {
              await prev;

              return readFileAsDataURL(imageFile).then((dataURL) => core.insertImage(editor, dataURL));
            }, Promise.resolve());

          return;
        }

        const inCaption = core.isSelectionInImageCaption(editor);

        if (inCaption) {
          const inlineData = new DataTransfer();

          inlineData.setData('text', data.getData('text').replace(/\r?\n/g, ''));

          insertData(inlineData);

          return;
        }

        insertData(data);
      };

      return core.with(editor);
    },
  };
}
