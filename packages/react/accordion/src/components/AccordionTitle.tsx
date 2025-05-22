import React from 'react';
import { RenderAccordionElementProps } from '../typings';

function AccordionTitle(props: RenderAccordionElementProps) {
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
