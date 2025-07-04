import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactCarousel } from '@quadrats/react/carousel';

export interface CarouselToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactCarousel;
}

function CarouselToolbarIcon(props: CarouselToolbarIconProps) {
  const { controller, ...rest } = props;

  return <ToolbarIcon {...rest} onClick={() => {}} />;
}

export default CarouselToolbarIcon;
