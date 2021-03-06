import {
  Editor,
  Element,
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

export interface ImageFigureElement extends Element, WithElementType {
  width?: number;
}

export interface ImageElement extends Element, WithElementType {
  children: [Text];
  src: string;
  /**
   * e.g. The src of image is `8gy9pbaht92y4.jpg` and your static files are hosted by `https://foo.storage`.
   * Then you can make the hosting of element be `foo`.
   */
  hosting?: string;
}

export interface ImageCaptionElement extends Element, WithElementType {}

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

export interface Image<Hosting extends string> extends Withable {
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
    editor: Editor,
    options?: ImageGetAboveImageFigureOptions
  ): NodeEntry<ImageFigureElement> | undefined;
  getAboveImageCaption(
    editor: Editor,
    options?: ImageGetAboveImageCaptionOptions
  ): NodeEntry<ImageCaptionElement> | undefined;
  isSelectionInImage(editor: Editor): boolean;
  isSelectionInImageCaption(editor: Editor): boolean;
  isCollapsedOnImage(editor: Editor): boolean;
  createImageElement(src: string, hosting?: Hosting): ImageFigureElement;
  insertImage(
    editor: Editor,
    src: string,
    options?: {
      hosting?: Hosting;
      at?: Location;
    }
  ): void;
  resizeImage(editor: Editor, entry: NodeEntry<Element>, width: number): void;
}
