import React from 'react';
import { RenderLineBreakElementProps } from './typings';

export const renderLineBreakElementWithSymbol = ({ attributes }: RenderLineBreakElementProps) => (
  <span {...attributes} style={{ userSelect: 'none' }} className="qdr-line-break__with-symbol" contentEditable={false}>
    <br />
  </span>
);
