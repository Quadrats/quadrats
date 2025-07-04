import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactCarousel } from '@quadrats/react/carousel';
import { useCarouselTool } from './useCarouselTool';

export interface CarouselToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactCarousel;
}

function CarouselToolbarIcon(props: CarouselToolbarIconProps) {
  const { controller, ...rest } = props;
  const { onClick } = useCarouselTool(controller);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default CarouselToolbarIcon;
