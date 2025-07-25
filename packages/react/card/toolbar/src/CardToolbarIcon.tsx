import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactCard } from '@quadrats/react/card';
import { useCardTool } from './useCardTool';

export interface CardToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactCard;
}

function CardToolbarIcon(props: CardToolbarIconProps) {
  const { controller, ...rest } = props;
  const { onClick } = useCardTool(controller);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default CardToolbarIcon;
