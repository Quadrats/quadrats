import React from 'react';
import { RenderLineBreakElementProps } from './typings';

export const defaultRenderLineBreakElement = ({ attributes }: RenderLineBreakElementProps) => (
  <span {...attributes} style={{ userSelect: 'none' }} contentEditable={false}>
    <br />
  </span>
);
