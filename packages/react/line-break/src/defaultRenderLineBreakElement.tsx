import React from 'react';
import { RenderLineBreakElementProps } from './typings';
import LineBreakIcon from './components/LineBreakIcon';

export const defaultRenderLineBreakElement = (props: RenderLineBreakElementProps) => (
  <LineBreakIcon {...props} />
);
