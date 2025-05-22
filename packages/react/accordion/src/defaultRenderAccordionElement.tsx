import React from 'react';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderAccordionElement = ({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
}) => (
  <div {...attributes} className="qdr-accordion">
    {children}
  </div>
);
