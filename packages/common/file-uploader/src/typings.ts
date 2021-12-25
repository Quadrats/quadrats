import {
  Editor,
  Element,
  Path,
  TransformsInsertNodesOptions,
  Withable,
} from '@quadrats/core';
import { GetFilesFromInputOptions } from './getFilesFromInput';

export interface XHRUploadHeaders {
  [name: string]: string;
}

export interface FileUploaderElement extends Element {
  type: string;
  register: (getPath: () => Path | undefined, onProgress: (percentage: number) => void) => VoidFunction;
}

/**
 * For creating temorary element while uploading.
 */
export type FileUploaderCreateElementByDataURL = (dataURL: string) => Element;
/**
 * For create element after uploaded.
 */
export type FileUploaderCreateElementByResponse = (response: any) => Element;

export type FileUploaderGetBody = (file: File) => BodyInit;
export type FileUploaderGetHeaders = (file: File) => XHRUploadHeaders | Promise<XHRUploadHeaders>;
export type FileUploaderGetUrl = (file: File) => string;

export interface FileUploaderCreateFileUploaderElementOptions {
  createElement: {
    [mime in string]?: {
      dataURL: FileUploaderCreateElementByDataURL;
      response: FileUploaderCreateElementByResponse;
    };
  };
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
}

export type FileUploaderUploadOptions = FileUploaderCreateFileUploaderElementOptions &
GetFilesFromInputOptions &
TransformsInsertNodesOptions;

export interface FileUploader extends Withable {
  type: string;
  createFileUploaderElement(
    editor: Editor,
    file: File,
    options: FileUploaderCreateFileUploaderElementOptions
  ): Promise<FileUploaderElement | undefined>;
  upload(editor: Editor, options: FileUploaderUploadOptions): Promise<void>;
}
