/* eslint-disable @typescript-eslint/naming-convention */
import { WithElementParent } from '@quadrats/core/serializers';
import { CardElement, CardTypeKey, CardImageTypeKey, CardContentsTypeKey, CARD_TYPES } from '@quadrats/common/card';
import { CreateJsxSerializeElementOptions, createJsxSerializeElements } from '@quadrats/react/jsx-serializer';
import { defaultRenderCardElements } from './defaultRenderCardElements';
import {
  JsxSerializeCardElementProps,
  JsxSerializeCardImageElementProps,
  JsxSerializeCardContentsElementProps,
} from './typings';

export type CreateJsxSerializeCardOptions = Partial<
  Record<CardTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCardElementProps>>> &
    Record<CardImageTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCardImageElementProps>>> &
    Record<CardContentsTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeCardContentsElementProps>>>
>;

export function createJsxSerializeCard(options: CreateJsxSerializeCardOptions = {}) {
  const { card = {}, card_image = {}, card_contents = {} } = options;

  const cardType = card.type || CARD_TYPES.card;
  const imageType = card_image.type || CARD_TYPES.card_image;
  const contentsType = card_contents.type || CARD_TYPES.card_contents;

  const renderCard = card.render || defaultRenderCardElements.card;
  const renderCardImage = card_image.render || defaultRenderCardElements.card_image;
  const renderCardContents = card_contents.render || defaultRenderCardElements.card_contents;

  return createJsxSerializeElements([
    {
      type: cardType,
      render: (props) => {
        const { children } = props;
        const element = props.element as CardElement & WithElementParent;

        return renderCard({
          children,
          element,
        });
      },
    },
    {
      type: imageType,
      render: (props) => {
        const { children, element } = props as JsxSerializeCardImageElementProps;

        return renderCardImage({
          children,
          element,
        });
      },
    },
    {
      type: contentsType,
      render: (props) => {
        const { children, element } = props as JsxSerializeCardContentsElementProps;

        return renderCardContents({
          children,
          element,
        });
      },
    },
  ]);
}
