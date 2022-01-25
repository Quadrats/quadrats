import React from 'react';
import { RenderLineBreakElementProps } from './typings';

export const defaultRenderLineBreakElement = ({ attributes, children }: RenderLineBreakElementProps) => (
  <span {...attributes} className="qdr-line-break">
    {children}
  </span>
);
