import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselImagesElementProps } from '../typings';

export function CarouselImages({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselImagesElementProps['element'];
  images: RenderCarouselImagesElementProps['images'];
  hosting?: RenderCarouselImagesElementProps['hosting'];
}) {
  console.log('first', attributes, children);

  return <div>CarouselImages</div>;
}

export default CarouselImages;
