import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactReadMore } from '@quadrats/react/read-more';
import { useReadMoreTool } from './useReadMoreTool';

export interface ReadMoreToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactReadMore;
}

function ReadMoreToolbarIcon(props: ReadMoreToolbarIconProps) {
  const { controller, ...rest } = props;
  const { onClick } = useReadMoreTool(controller);

  return <ToolbarIcon {...rest} onClick={onClick} />;
}

export default ReadMoreToolbarIcon;
