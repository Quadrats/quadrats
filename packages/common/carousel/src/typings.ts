import { Editor, Withable, QuadratsElement, WithElementType, Text } from '@quadrats/core';

export type CarouselTypeKey = 'carousel';
export type CarouselImagesTypeKey = 'carousel_images';
export type CarouselCaptionTypeKey = 'carousel_caption';

export type CarouselTypes = Record<CarouselTypeKey | CarouselImagesTypeKey | CarouselCaptionTypeKey, string>;

export interface CarouselElement extends QuadratsElement, WithElementType {}

export interface CarouselImagesElement extends QuadratsElement, WithElementType {
  children: [Text];
  images: string[];
  hosting?: string;
}

export interface CarouselCaptionElement extends QuadratsElement, WithElementType {}

export interface CarouselPlaceholderElement extends QuadratsElement, WithElementType {
  children: [Text];
}

export interface XHRUploadHeaders {
  [name: string]: string;
}

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

export type FileUploaderGetBody = (file: File) => BodyInit;
export type FileUploaderGetHeaders = (file: File) => XHRUploadHeaders | Promise<XHRUploadHeaders>;
export type FileUploaderGetUrl = (file: File) => string;

export interface Carousel<T extends Editor = Editor> extends Withable {
  types: CarouselTypes;
  insertCarouselPlaceholder(editor: T): void;
  removeCarouselPlaceholder(editor: T): void;
  accept: string[];
  maxLength: number;
  limitSize: number;
  upload(editor: T): Promise<void>;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
