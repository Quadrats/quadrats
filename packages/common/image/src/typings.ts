import {
  Editor,
  QuadratsElement,
  GetAboveByTypesOptions,
  Location,
  NodeEntry,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export type ImageFigureTypeKey = 'figure';
export type ImageTypeKey = 'image';
export type ImageCaptionTypeKey = 'caption';

export type ImageTypes = Record<ImageFigureTypeKey | ImageTypeKey | ImageCaptionTypeKey, string>;

export interface ImageFigureElement extends QuadratsElement, WithElementType {
  width?: number;
}

export interface ImageElement extends QuadratsElement, WithElementType {
  children: [Text];
  src: string;
  /**
   * e.g. The src of image is `8gy9pbaht92y4.jpg` and your static files are hosted by `https://foo.storage`.
   * Then you can make the hosting of element be `foo`.
   */
  hosting?: string;
}

export interface ImageCaptionElement extends QuadratsElement, WithElementType {}

/**
 * Indicate how to resolve the `src` and `hosting` of image element.
 * If there is an image element which hosting is `foo`, then `hostingResolvers.foo` will be used to resolve them to url.
 *
 * @example
 * const element = {
 *   src: '8gy9pbaht92y4.jpg',
 *   hosting: 'foo'
 * };
 * const hostingResolvers = {
 *   foo: src => `https://foo.storage/${src}`
 * };
 */
export type ImageHostingResolvers<Hosting extends string> = Record<Hosting, (url: string) => string>;

/**
 * Only sizes included in steps are valid image size.
 */
export type ImageSizeSteps = ReadonlyArray<number>;

export type ImageGetAboveImageFigureOptions = GetAboveByTypesOptions;
export type ImageGetAboveImageCaptionOptions = GetAboveByTypesOptions;

export interface Image<Hosting extends string, T extends Editor = Editor> extends Withable {
  /**
   * An object which keys are `figure`, `image`, 'caption` and values are the corresponding element types.
   */
  types: ImageTypes;
  /**
   * @see {ImageHostingResolvers<Hosting>}
   */
  hostingResolvers?: ImageHostingResolvers<Hosting>;
  /**
   * @see {ImageSizeSteps}
   */
  sizeSteps?: ImageSizeSteps;
  isImageUrl(url: string): boolean;
  getAboveImageFigure(
    editor: T,
    options?: ImageGetAboveImageFigureOptions
  ): NodeEntry<ImageFigureElement> | undefined;
  getAboveImageCaption(
    editor: T,
    options?: ImageGetAboveImageCaptionOptions
  ): NodeEntry<ImageCaptionElement> | undefined;
  isSelectionInImage(editor: T): boolean;
  isSelectionInImageCaption(editor: T): boolean;
  isCollapsedOnImage(editor: T): boolean;
  createImageElement(src: string, hosting?: Hosting): ImageFigureElement;
  insertImage(
    editor: T,
    src: string,
    options?: {
      hosting?: Hosting;
      at?: Location;
    }
  ): void;
  resizeImage(editor: T, entry: NodeEntry<QuadratsElement>, width: number): void;
}
