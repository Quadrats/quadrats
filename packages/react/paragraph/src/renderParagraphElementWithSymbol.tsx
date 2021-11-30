import React from 'react';
import { RenderElementProps } from '@quadrats/react';

export const renderParagraphElementWithSymbol = ({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: any;
}) => (
  <p {...attributes} className="qdr-paragraph__with-line-break-symbol">
    {children}
  </p>
);
