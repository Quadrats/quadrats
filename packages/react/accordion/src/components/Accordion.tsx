import React from 'react';
import { Icon } from '@quadrats/react/components';
import { AccordionDown } from '@quadrats/icons';
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
      <div className="qdr-accordion__icon">
        <Icon icon={AccordionDown} width={24} height={24} />
      </div>
      <div className="qdr-accordion__wrapper">
        {children}
      </div>
    </div>
  );
}

export default Accordion;
