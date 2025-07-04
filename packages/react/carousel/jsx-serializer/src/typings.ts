import {
  CarouselElement,
  CarouselImagesElement,
  CarouselCaptionElement,
  CarouselTypeKey,
  CarouselImagesTypeKey,
  CarouselCaptionTypeKey,
} from '@quadrats/common/carousel';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export interface JsxSerializeCarouselElementProps extends JsxSerializeElementProps<CarouselElement> {}
export interface JsxSerializeCarouselImagesElementProps extends JsxSerializeElementProps<CarouselImagesElement> {
  images: string;
  hosting?: string;
}
export interface JsxSerializeCarouselCaptionElementProps extends JsxSerializeElementProps<CarouselCaptionElement> {}

export type CarouselJsxSerializeElements = Record<
  CarouselTypeKey,
  (props: JsxSerializeCarouselElementProps) => JSX.Element | null | undefined
> &
  Record<CarouselImagesTypeKey, (props: JsxSerializeCarouselImagesElementProps) => JSX.Element | null | undefined> &
  Record<CarouselCaptionTypeKey, (props: JsxSerializeCarouselCaptionElementProps) => JSX.Element | null | undefined>;
