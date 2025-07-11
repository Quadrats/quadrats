/* eslint-disable @typescript-eslint/naming-convention */
import { WithElementParent } from '@quadrats/core/serializers';
import {
  CarouselElement,
  CarouselTypeKey,
  CarouselImagesTypeKey,
  CarouselCaptionTypeKey,
  CAROUSEL_TYPES,
} from '@quadrats/common/carousel';
import { CreateJsxSerializeElementOptions, createJsxSerializeElements } from '@quadrats/react/jsx-serializer';
import { defaultRenderCarouselElements } from './defaultRenderCarouselElements';
import {
  JsxSerializeCarouselElementProps,
  JsxSerializeCarouselImagesElementProps,
  JsxSerializeCarouselCaptionElementProps,
} from './typings';

export type CreateJsxSerializeCarouselOptions = Partial<
  Record<CarouselTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCarouselElementProps>>> &
    Record<CarouselImagesTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCarouselImagesElementProps>>> &
    Record<CarouselCaptionTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCarouselCaptionElementProps>>>
>;

export function createJsxSerializeCarousel(options: CreateJsxSerializeCarouselOptions = {}) {
  const { carousel = {}, carousel_images = {}, carousel_caption = {} } = options;

  const carouselType = carousel.type || CAROUSEL_TYPES.carousel;
  const imagesType = carousel_images.type || CAROUSEL_TYPES.carousel_images;
  const captionType = carousel_caption.type || CAROUSEL_TYPES.carousel_caption;

  const renderCarousel = carousel.render || defaultRenderCarouselElements.carousel;
  const renderCarouselImages = carousel_images.render || defaultRenderCarouselElements.carousel_images;
  const renderCarouselCaption = carousel_caption.render || defaultRenderCarouselElements.carousel_caption;

  return createJsxSerializeElements([
    {
      type: carouselType,
      render: (props) => {
        const { children } = props;
        const element = props.element as CarouselElement & WithElementParent;

        return renderCarousel({
          children,
          element,
        });
      },
    },
    {
      type: imagesType,
      render: (props) => {
        const { children, element } = props as JsxSerializeCarouselImagesElementProps;

        return renderCarouselImages({
          children,
          element,
        });
      },
    },
    {
      type: captionType,
      render: (props) => {
        const { children, element } = props as JsxSerializeCarouselCaptionElementProps;

        return renderCarouselCaption({
          children,
          element,
        });
      },
    },
  ]);
}
