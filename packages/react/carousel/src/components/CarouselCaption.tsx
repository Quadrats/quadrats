import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselCaptionElementProps } from '../typings';

export function CarouselCaption({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselCaptionElementProps['element'];
}) {
  console.log('first', attributes, children, element);

  return <div>CarouselCaption</div>;
}

export default CarouselCaption;
