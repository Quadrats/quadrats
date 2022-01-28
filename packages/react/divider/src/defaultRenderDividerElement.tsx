import React from 'react';
import { RenderDividerElementProps } from './typings';

export const defaultRenderDividerElement = ({ attributes, children }: RenderDividerElementProps) => (
  <div {...attributes} className="qdr-divider" contentEditable={false}>
    <hr />
    {children}
  </div>
);
