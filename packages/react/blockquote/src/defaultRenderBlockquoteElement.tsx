import React from 'react';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderBlockquoteElement = ({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
}) => (
  <blockquote {...attributes} className="qdr-blockquote">
    {children}
  </blockquote>
);
