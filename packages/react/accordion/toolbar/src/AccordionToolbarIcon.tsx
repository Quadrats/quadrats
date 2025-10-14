import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactAccordion } from '@quadrats/react/accordion';
import { useAccordionTool } from './useAccordionTool';

export interface AccordionToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactAccordion;
}

function AccordionToolbarIcon(props: AccordionToolbarIconProps) {
  const { controller, ...rest } = props;
  const { onClick } = useAccordionTool(controller);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default AccordionToolbarIcon;
