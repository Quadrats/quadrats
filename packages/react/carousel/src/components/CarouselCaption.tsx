import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselCaptionElementProps } from '../typings';

export function CarouselCaption({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselCaptionElementProps['element'];
}) {
  console.log('first', attributes, children);

  return <div>CarouselCaption</div>;
}

export default CarouselCaption;
