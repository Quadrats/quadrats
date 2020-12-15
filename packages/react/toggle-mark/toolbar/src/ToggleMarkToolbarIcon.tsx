import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactToggleMark } from '@quadrats/react/toggle-mark';
import { useToggleMarkTool } from './useToggleMarkTool';

export interface ToggleMarkToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactToggleMark;
}

function ToggleMarkToolbarIcon(props: ToggleMarkToolbarIconProps) {
  const { controller, ...rest } = props;
  const { active, onClick } = useToggleMarkTool(controller);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default ToggleMarkToolbarIcon;
