import React from 'react';
import { RenderAccordionElementProps } from '../typings';

function Accordion(props: RenderAccordionElementProps) {
  const {
    attributes,
  } = props;

  return (
    <div
      {...attributes}
      className="qdr-accordion"
    >

    </div>
  );
}

export default Accordion;
