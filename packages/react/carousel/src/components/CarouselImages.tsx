import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselImagesElementProps } from '../typings';

function CarouselImages({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselImagesElementProps['element'];
}) {
  console.log('first', attributes, children);

  return <div>CarouselImages</div>;
}

export default CarouselImages;
