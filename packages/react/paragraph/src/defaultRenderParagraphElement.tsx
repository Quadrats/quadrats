import React from 'react';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderParagraphElement = ({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: any;
}) => (
  <p {...attributes} className="qdr-paragraph">
    {children}
  </p>
);
