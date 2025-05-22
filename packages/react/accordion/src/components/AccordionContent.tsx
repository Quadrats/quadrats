import React from 'react';
import { RenderAccordionElementProps } from '../typings';

function AccordionContent(props: RenderAccordionElementProps) {
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
