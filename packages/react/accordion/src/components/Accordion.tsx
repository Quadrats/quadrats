import React, { useState } from 'react';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { AccordionDown } from '@quadrats/icons';
import { RenderElementProps } from '@quadrats/react';
import { AccordionContext } from '../contexts/AccordionContext';
import { RenderAccordionElementProps } from '../typings';

function Accordion({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderAccordionElementProps['element'];
}) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <AccordionContext.Provider
      value={{
        expanded,
      }}
    >
      <div
        {...attributes}
        className="qdr-accordion"
      >
        <div
          className="qdr-accordion__icon-wrapper"
          contentEditable={false}
          onClick={() => {
            setExpanded(status => !status);
          }}
        >
          <Icon
            className={clsx('qdr-accordion__icon', {
              'qdr-accordion__icon--expanded': expanded,
            })}
            icon={AccordionDown}
            width={24}
            height={24}
          />
        </div>
        <div className="qdr-accordion__wrapper">
          {children}
        </div>
      </div>
    </AccordionContext.Provider>
  );
}

export default Accordion;
