import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { RenderAccordionElementProps } from '../typings';

function Accordion({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderAccordionElementProps['element'];
}) {

  return (
    <div
      {...attributes}
      className="qdr-accordion"
    >
      {children}
    </div>
  );
}

export default Accordion;
