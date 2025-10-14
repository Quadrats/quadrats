import React from 'react';
import { CardWithoutToolbar, CardImage, CardContents } from '@quadrats/react/card';
import { CardJsxSerializeElements } from './typings';

export const defaultRenderCardElements: CardJsxSerializeElements = {
  card: (props) => <CardWithoutToolbar {...props} />,
  card_image: (props) => <CardImage {...props} />,
  card_contents: (props) => <CardContents {...props} />,
};
