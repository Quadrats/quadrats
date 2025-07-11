import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselImagesElementProps } from '../typings';

export function CarouselImages({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselImagesElementProps['element'];
}) {
  console.log('CarouselImages', element);

  return (
    <div {...attributes} contentEditable={false}>
      CarouselImages
    </div>
  );
}

export default CarouselImages;
