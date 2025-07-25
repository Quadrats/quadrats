import { createCard, CreateCardOptions, CARD_PLACEHOLDER_TYPE } from '@quadrats/common/card';
import { createRenderElement, createRenderElements } from '@quadrats/react';
// import { removePreviousElement } from '@quadrats/react/utils';
import { defaultRenderCardElements, defaultRenderCardPlaceholderElement } from './defaultRenderCardElements';
import {
  ReactCard,
  RenderCardElementProps,
  RenderCardImageElementProps,
  RenderCardContentsElementProps,
} from './typings';

export type CreateReactCardOptions = CreateCardOptions;

export function createReactCard(options: CreateReactCardOptions): ReactCard {
  const core = createCard(options);

  const { types } = core;

  return {
    ...core,
    createHandlers: (setNeedConfirmModal, locale) => ({
      onKeyDown(event, editor, next) {
        if (event.key === 'Backspace') {
          console.log('setNeedConfirmModal', editor, setNeedConfirmModal, locale);
        }

        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderCard = options.card || defaultRenderCardElements.card;
      const renderCardImage = options.card_image || defaultRenderCardElements.card_image;
      const renderCardContents = options.card_contents || defaultRenderCardElements.card_contents;

      return createRenderElements([
        {
          type: types.card,
          render: (props) => {
            const { attributes, children, element } = props as RenderCardElementProps;

            return renderCard({
              attributes,
              element,
              children,
              controller: core,
            });
          },
        },
        {
          type: types.card_image,
          render: (props) => {
            const { attributes, children, element } = props as RenderCardImageElementProps;

            return renderCardImage({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.card_contents,
          render: (props) => {
            const { attributes, children, element } = props as RenderCardContentsElementProps;

            return renderCardContents({
              attributes,
              element,
              children,
            });
          },
        },
      ]);
    },
    createRenderPlaceholderElement: ({ render = defaultRenderCardPlaceholderElement } = {}) =>
      createRenderElement({
        type: CARD_PLACEHOLDER_TYPE,
        render,
      }),
  };
}
