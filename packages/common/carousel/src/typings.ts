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

export interface Carousel<T extends Editor = Editor> extends Withable {
  types: CarouselTypes;
  insertCarouselPlaceholder(editor: T): void;
  removeCarouselPlaceholder(editor: T): void;
  accept: string[];
  maxLength: number;
  limitSize: number;
}
