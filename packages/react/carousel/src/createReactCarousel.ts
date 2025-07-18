import { createCarousel, CreateCarouselOptions, CAROUSEL_PLACEHOLDER_TYPE } from '@quadrats/common/carousel';
import { createRenderElement, createRenderElements } from '@quadrats/react';
import { removePreviousElement } from '@quadrats/react/utils';
import {
  defaultRenderCarouselElements,
  defaultRenderCarouselPlaceholderElement,
} from './defaultRenderCarouselElements';
import {
  ReactCarousel,
  RenderCarouselElementProps,
  RenderCarouselImagesElementProps,
  RenderCarouselCaptionElementProps,
} from './typings';

export type CreateReactCarouselOptions = CreateCarouselOptions;

export function createReactCarousel(options: CreateReactCarouselOptions): ReactCarousel {
  const core = createCarousel(options);

  const { types } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown(event, editor, next) {
        if (event.key === 'Backspace') {
          removePreviousElement(event, editor, types.carousel);
        }

        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderCarousel = options.carousel || defaultRenderCarouselElements.carousel;
      const renderCarouselImages = options.carousel_images || defaultRenderCarouselElements.carousel_images;
      const renderCarouselCaption = options.carousel_caption || defaultRenderCarouselElements.carousel_caption;

      return createRenderElements([
        {
          type: types.carousel,
          render: (props) => {
            const { attributes, children, element } = props as RenderCarouselElementProps;

            return renderCarousel({
              attributes,
              element,
              children,
              controller: core,
            });
          },
        },
        {
          type: types.carousel_images,
          render: (props) => {
            const { attributes, children, element } = props as RenderCarouselImagesElementProps;

            return renderCarouselImages({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.carousel_caption,
          render: (props) => {
            const { attributes, children, element } = props as RenderCarouselCaptionElementProps;

            return renderCarouselCaption({
              attributes,
              element,
              children,
            });
          },
        },
      ]);
    },
    createRenderPlaceholderElement: ({ render = defaultRenderCarouselPlaceholderElement } = {}) =>
      createRenderElement({
        type: CAROUSEL_PLACEHOLDER_TYPE,
        render,
      }),
  };
}
