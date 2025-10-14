import React from 'react';
import { ParagraphElement } from '@quadrats/common/paragraph';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderParagraphElement = ({
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
    <p {...attributes} className="qdr-paragraph" style={style}>
      {children}
    </p>
  );
};
