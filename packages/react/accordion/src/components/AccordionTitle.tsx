import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function AccordionTitle(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
}) {
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      className="qdr-accordion__title"
    >
      {children}
    </div>
  );
}

export default AccordionTitle;
