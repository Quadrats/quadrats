import {
  Editor,
  QuadratsElement,
  Path,
  TransformsInsertNodesOptions,
  Withable,
  WithElementType,
  Text,
} from '@quadrats/core';
import { GetFilesFromInputOptions } from './getFilesFromInput';

export type ImageAccept = 'image/jpeg' | 'image/jpg' | 'image/png';

export interface XHRUploadHeaders {
  [name: string]: string;
}

export interface FileUploaderElement extends QuadratsElement {
  type: string;
  register: (getPath: () => Path | undefined, onProgress: (percentage: number) => void) => VoidFunction;
}

/**
 * For creating temorary element while uploading.
 */
export type FileUploaderCreateElementByDataURL = (dataURL: string) => QuadratsElement;
/**
 * For create element after uploaded.
 */
export type FileUploaderCreateElementByResponse = (response: any) => QuadratsElement;

export type FileUploaderGetBody = (file: File) => BodyInit;
export type FileUploaderGetHeaders = (file: File) => XHRUploadHeaders | Promise<XHRUploadHeaders>;
export type FileUploaderGetUrl = (file: File) => string;

interface FileUploaderUploadImplementOnProgressArgs {
  loaded: number;
  total: number;
}

interface FileUploaderUploadImplement {
  onprogress: ((options: FileUploaderUploadImplementOnProgressArgs) => void) | null;
}

export interface FileUploaderImplement {
  onload: (() => void) | null;
  open: (method: string, url: string | URL) => void;
  setRequestHeader: (key: string, value: string) => void;
  send(body?: Document | BodyInit | null): void;
  readonly status: number;
  readonly response: any;
  readonly upload: FileUploaderUploadImplement;
}

export interface UploaderPlaceholderElement extends QuadratsElement, WithElementType {
  children: [Text];
}

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
  uploader?: FileUploaderImplement;
}

export type FileUploaderUploadOptions = FileUploaderCreateFileUploaderElementOptions &
  GetFilesFromInputOptions &
  TransformsInsertNodesOptions;

export interface FileUploader<T extends Editor = Editor> extends Withable {
  type: string;
  createFileUploaderElement(
    editor: T,
    file: File,
    options: FileUploaderCreateFileUploaderElementOptions,
  ): Promise<FileUploaderElement | undefined>;
  upload(editor: T, options: FileUploaderUploadOptions): Promise<void>;
  insertUploaderPlaceholder(editor: T): void;
  removeUploaderPlaceholder(editor: T): void;
}
