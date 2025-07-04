import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactAccordion } from '@quadrats/react/accordion';

export interface CarouselToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactAccordion;
}

function CarouselToolbarIcon(props: CarouselToolbarIconProps) {
  const { controller, ...rest } = props;

  return <ToolbarIcon {...rest} onClick={() => {}} />;
}

export default CarouselToolbarIcon;
