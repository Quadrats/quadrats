import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselElementProps } from '../typings';

function Carousel({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselElementProps['element'];
}) {
  console.log('first', attributes, children);

  return <div>Carousel</div>;
}

export default Carousel;
