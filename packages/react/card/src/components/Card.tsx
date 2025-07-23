import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { Edit, Trash } from '@quadrats/icons';
import { RenderCardElementProps } from '../typings';

export function Card({
  attributes,
  children,
  // element,
  // controller,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardElementProps['element'];
  controller: RenderCardElementProps['controller'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card">
      <InlineToolbar
        className="qdr-card__inline-toolbar"
        leftIcons={[]}
        rightIcons={[
          {
            icon: Edit,
            onClick: () => {},
          },
          {
            icon: Trash,
            onClick: () => {},
          },
        ]}
      />
      {children}
    </div>
  );
}

export function CardWithoutToolbar({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card">
      {children}
    </div>
  );
}

export default Card;
