import React from 'react';
import { RenderLineBreakElementProps } from './typings';

export const renderLineBreakElementWithSymbol = ({ attributes, children }: RenderLineBreakElementProps) => (
  <span {...attributes} className="qdr-line-break qdr-line-break__with-symbol">
    {children}
  </span>
);
