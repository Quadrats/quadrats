import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCarouselCaptionElementProps } from '../typings';

export function CarouselCaption({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselCaptionElementProps['element'];
}) {
  console.log('CarouselCaption', element);

  return (
    <div {...attributes} contentEditable={false}>
      CarouselCaption
    </div>
  );
}

export default CarouselCaption;
