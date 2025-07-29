import React from 'react';
import { Paragraph } from '@quadrats/common/paragraph';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { useToggleParagraphTool } from './useToggleParagraphTool';

export interface ParagraphToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: Paragraph;
}

function ParagraphToolbarIcon(props: ParagraphToolbarIconProps) {
  const { controller, ...rest } = props;
  const { active, onClick } = useToggleParagraphTool(controller);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default ParagraphToolbarIcon;
