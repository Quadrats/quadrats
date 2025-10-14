import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactAlign } from '@quadrats/react/align';
import { AlignValue } from '@quadrats/common/align';
import { useAlignTool } from './useAlignTool';

export interface AlignToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactAlign;
  value: AlignValue;
}

function AlignToolbarIcon(props: AlignToolbarIconProps) {
  const { controller, value, ...rest } = props;
  const { active, onClick } = useAlignTool(controller, value);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default AlignToolbarIcon;
