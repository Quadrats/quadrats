import React from 'react';
import { ReactLineBreakIconElementProps } from './typings';
import LineBreakIcon from './components/LineBreakIcon';

export const defaultRenderLineBreakElement = (props: ReactLineBreakIconElementProps) => (
  <LineBreakIcon {...props} />
);
