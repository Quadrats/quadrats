import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function AccordionContent(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
}) {
  const { attributes, children } = props;

  return (
    <div
      {...attributes}
      className="qdr-accordion__content"
    >
      {children}
    </div>
  );
}

export default AccordionContent;
