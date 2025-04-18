import { JSX } from 'react';
import {
  Image,
  ImageCaptionElement,
  ImageCaptionTypeKey,
  ImageElement,
  ImageFigureElement,
  ImageFigureTypeKey,
  ImageTypeKey,
} from '@quadrats/common/image';
import {
  WithCreateHandlers,
  WithCreateRenderElement,
  RenderElementProps,
  ReactWithable,
  Editor,
} from '@quadrats/react';

export interface RenderImageFigureElementProps extends RenderElementProps<ImageFigureElement> {
  style?: {
    width: string;
  };
}

export interface RenderImageElementProps extends RenderElementProps<ImageElement> {
  resizeImage: ReactImage<any>['resizeImage'];
  src: string;
}

export type RenderImageCaptionElementProps = RenderElementProps<ImageCaptionElement>;

export type ImageRenderElements = Record<
ImageFigureTypeKey,
(props: RenderImageFigureElementProps) => JSX.Element | null | undefined
> &
Record<ImageTypeKey, (props: RenderImageElementProps) => JSX.Element | null | undefined> &
Record<ImageCaptionTypeKey, (props: RenderImageCaptionElementProps) => JSX.Element | null | undefined>;

export type ReactImageCreateRenderElementOptions = {
  [K in ImageFigureTypeKey | ImageTypeKey | ImageCaptionTypeKey]?: ImageRenderElements[K];
};

export interface ReactImage<Hosting extends string>
  extends Omit<Image<Hosting, Editor>, 'with'>,
  WithCreateHandlers,
  WithCreateRenderElement<[ReactImageCreateRenderElementOptions?]>,
  ReactWithable {}
