import React from 'react';
import Card from './components/Card';
import CardImage from './components/CardImage';
import CardContents from './components/CardContents';
import CardPlaceholder from './components/CardPlaceholder';
import { CardRenderElements, RenderCardPlaceholderElement } from './typings';

export const defaultRenderCardElements: CardRenderElements = {
  card: (props) => <Card {...props} />,
  card_image: (props) => <CardImage {...props} />,
  card_contents: (props) => <CardContents {...props} />,
};

export const defaultRenderCardPlaceholderElement: RenderCardPlaceholderElement = (props) => (
  <CardPlaceholder {...props} />
);
