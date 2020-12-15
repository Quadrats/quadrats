import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactLink } from '@quadrats/react/link';
import { useLinkTool, UseLinkToolOptions } from './useLinkTool';

export interface LinkToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactLink;
  options?: UseLinkToolOptions;
}

function LinkToolbarIcon(props: LinkToolbarIconProps) {
  const { controller, options = {}, ...rest } = props;
  const { active, onClick } = useLinkTool(controller, options);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default LinkToolbarIcon;
