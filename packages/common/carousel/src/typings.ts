import { Editor, Withable, QuadratsElement, WithElementType, Text, Path } from '@quadrats/core';

export type CarouselTypeKey = 'carousel';
export type CarouselImagesTypeKey = 'carousel_images';
export type CarouselCaptionTypeKey = 'carousel_caption';

export type CarouselTypes = Record<CarouselTypeKey | CarouselImagesTypeKey | CarouselCaptionTypeKey, string>;

export interface CarouselFieldArrayItem {
  file: File;
  progress: number;
  preview: string;
  url: string;
  caption: string;
}

export interface CarouselElement extends QuadratsElement, WithElementType {
  items: CarouselFieldArrayItem[];
}

export interface CarouselImagesElement extends QuadratsElement, WithElementType {
  children: [Text];
  ratio?: [number, number];
  images: string[];
}

export interface CarouselCaptionElement extends QuadratsElement, WithElementType {
  children: [Text];
  captions: string[];
}

export interface CarouselPlaceholderElement extends QuadratsElement, WithElementType {
  ratio?: [number, number];
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
  createCarouselElement({ items }: { items: CarouselFieldArrayItem[] }): CarouselElement;
  insertCarousel({ editor, items }: { editor: T; items: CarouselFieldArrayItem[] }): void;
  updateCarouselElement({ editor, items, path }: { editor: T; items: CarouselFieldArrayItem[]; path: Path }): void;
  accept: string[];
  ratio?: [number, number];
  maxLength: number;
  limitSize: number;
  confirmModal: boolean;
  selectFiles(editor: T): Promise<File[] | undefined>;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
