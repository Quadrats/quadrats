import { Editor, Withable, QuadratsElement, WithElementType, Text, Path } from '@quadrats/core';
import {
  ImageAccept,
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
} from '@quadrats/common/file-uploader';

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
  isError?: boolean;
}

export interface CarouselElement extends QuadratsElement, WithElementType {
  confirmModal: boolean;
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

export interface Carousel<T extends Editor = Editor> extends Withable {
  types: CarouselTypes;
  insertCarouselPlaceholder(editor: T): void;
  removeCarouselPlaceholder(editor: T): void;
  createCarouselElement({ items }: { items: CarouselFieldArrayItem[] }): CarouselElement;
  insertCarousel({ editor, items }: { editor: T; items: CarouselFieldArrayItem[] }): void;
  updateCarouselElement({ editor, items, path }: { editor: T; items: CarouselFieldArrayItem[]; path: Path }): void;
  accept: ImageAccept[];
  ratio?: [number, number];
  maxLength: number;
  limitSize: number;
  confirmModal: boolean;
  selectFiles(): Promise<File[] | undefined>;
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
}
