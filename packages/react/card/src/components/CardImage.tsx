import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCardImageElementProps } from '../typings';

export function CardImage({
  attributes,
  // element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardImageElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card__image">
      CardImage
    </div>
  );
}

export default CardImage;
