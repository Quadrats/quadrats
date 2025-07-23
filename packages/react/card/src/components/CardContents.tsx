import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderCardContentsElementProps } from '../typings';

export function CardContents({
  attributes,
  // element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardContentsElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card__contents">
      CardContents
    </div>
  );
}

export default CardContents;
