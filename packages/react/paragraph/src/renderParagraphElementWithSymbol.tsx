import React from 'react';
import { ParagraphElement } from '@quadrats/common/paragraph';
import { RenderElementProps } from '@quadrats/react';

export const renderParagraphElementWithSymbol = ({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: any;
  element: ParagraphElement;
}) => {
  const style = element.align ? { textAlign: element.align } : undefined;

  return (
    <p {...attributes} className="qdr-paragraph qdr-paragraph__with-line-break-symbol" style={style}>
      {children}
    </p>
  );
};
