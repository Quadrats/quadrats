import React from 'react';
import { ReactLineBreak } from '@quadrats/react/line-break';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { useToggleLineBreakTool } from './useToggleLineBreakTool';

export interface LineBReakToolbarIconProps
  extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactLineBreak;
}

function LineBreakToolbarIcon(props: LineBReakToolbarIconProps) {
  const { controller, ...rest } = props;
  const { active, onClick } = useToggleLineBreakTool(controller);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default LineBreakToolbarIcon;
