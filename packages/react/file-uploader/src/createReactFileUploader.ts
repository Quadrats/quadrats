import { createFileUploader, FILE_UPLOADER_PLACEHOLDER_TYPE } from '@quadrats/common/file-uploader';
import { createRenderElement } from '@quadrats/react';
import { ReactFileUploader } from './typings';
import {
  defaultRenderFileUploaderElement,
  defaultRenderFileUploaderPlaceholderElement,
} from './defaultRenderFileUploaderElement';

export interface CreateReactFileUploaderOptions {
  type?: string;
}

export function createReactFileUploader(options: CreateReactFileUploaderOptions = {}): ReactFileUploader {
  const core = createFileUploader(options);
  const { type } = core;

  return {
    ...core,
    createRenderElement: ({ render = defaultRenderFileUploaderElement } = {}) => createRenderElement({
      type,
      render,
    }),
    createRenderPlaceholderElement: ({ render = defaultRenderFileUploaderPlaceholderElement } = {}) =>
      createRenderElement({
        type: FILE_UPLOADER_PLACEHOLDER_TYPE,
        render,
      }),
  };
}
