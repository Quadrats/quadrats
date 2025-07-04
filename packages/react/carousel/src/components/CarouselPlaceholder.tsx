import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function CarouselPlaceholder({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  console.log('first', attributes, children);

  return <div>CarouselPlaceholder</div>;
}

export default CarouselPlaceholder;
