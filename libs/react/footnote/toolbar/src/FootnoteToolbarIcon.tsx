import React from 'react';
import { ToolbarIcon, ToolbarIconProps } from '@quadrats/react/toolbar';
import { ReactFootnote } from '@quadrats/react/footnote';
import { useFootnoteTool, UseFootnoteToolOptions } from './useFootnoteTool';

export interface FootnoteToolbarIconProps extends Omit<ToolbarIconProps, 'active' | 'onClick'> {
  controller: ReactFootnote;
  options?: UseFootnoteToolOptions;
}

function FootnoteToolbarIcon(props: FootnoteToolbarIconProps) {
  const { controller, options = {}, ...rest } = props;
  const { active, onClick } = useFootnoteTool(controller, options);

  return <ToolbarIcon {...rest} active={active} onClick={onClick} />;
}

export default FootnoteToolbarIcon;
