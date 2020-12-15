import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactBlockquote } from '@quadrats/react/blockquote';
import { useBlockquoteTool } from './useBlockquoteTool';

export interface BlockquoteToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactBlockquote;
}

function BlockquoteToolbarIcon(props: BlockquoteToolbarIconProps) {
  const { controller, ...rest } = props;
  const { active, onClick } = useBlockquoteTool(controller);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default BlockquoteToolbarIcon;
