import { Dispatch, SetStateAction } from 'react';
import {
  Carousel,
  CarouselElement,
  CarouselImagesElement,
  CarouselCaptionElement,
  CarouselPlaceholderElement,
  CarouselTypeKey,
  CarouselImagesTypeKey,
  CarouselCaptionTypeKey,
} from '@quadrats/common/carousel';
import { RenderElementProps, Editor, WithCreateRenderElement, Handlers, ConfirmModalConfig } from '@quadrats/react';
import { LocaleDefinition } from '@quadrats/locales';

export type CarouselContextType = {
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
};

export interface RenderCarouselElementProps extends RenderElementProps<CarouselElement> {
  controller: Carousel<Editor>;
}

export interface RenderCarouselImagesElementProps extends RenderElementProps<CarouselImagesElement> {}

export type RenderCarouselCaptionElementProps = RenderElementProps<CarouselCaptionElement>;

export interface RenderCarouselPlaceholderElementProps extends RenderElementProps<CarouselPlaceholderElement> {}

export type RenderCarouselPlaceholderElement = (
  props: RenderCarouselPlaceholderElementProps,
) => JSX.Element | null | undefined;

export type CarouselRenderElements = Record<
  CarouselTypeKey,
  (props: RenderCarouselElementProps) => JSX.Element | null | undefined
> &
  Record<CarouselImagesTypeKey, (props: RenderCarouselImagesElementProps) => JSX.Element | null | undefined> &
  Record<CarouselCaptionTypeKey, (props: RenderCarouselCaptionElementProps) => JSX.Element | null | undefined>;

export type ReactCarouselCreateRenderElementOptions = {
  [K in CarouselTypeKey | CarouselImagesTypeKey | CarouselCaptionTypeKey]?: CarouselRenderElements[K];
};

export interface ReactCarousel
  extends Carousel<Editor>,
    WithCreateRenderElement<[ReactCarouselCreateRenderElementOptions?]> {
  createHandlers: (
    setNeedConfirmModal?: Dispatch<SetStateAction<ConfirmModalConfig | null>>,
    locale?: LocaleDefinition,
  ) => Handlers;
  createRenderPlaceholderElement: (params_0?: {
    render?: RenderCarouselPlaceholderElement;
  }) => (props: RenderElementProps) => JSX.Element | null | undefined;
}
