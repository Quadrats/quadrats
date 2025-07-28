import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCardImageElementProps } from '../typings';

export function CardImage({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardImageElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card__image-wrapper">
      <img
        draggable={false}
        className="qdr-card__image"
        src={element.src}
        style={{
          objectFit: element.ratio ? 'cover' : 'contain',
          aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '1 / 1',
        }}
      />
    </div>
  );
}

export default CardImage;
