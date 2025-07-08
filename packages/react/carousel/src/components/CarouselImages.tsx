import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselImagesElementProps } from '../typings';

export function CarouselImages({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselImagesElementProps['element'];
}) {
  console.log('first', attributes, children, element);

  return <div>CarouselImages</div>;
}

export default CarouselImages;
