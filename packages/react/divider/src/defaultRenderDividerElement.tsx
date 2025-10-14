import React from 'react';
import { RenderDividerElementProps } from './typings';

export const defaultRenderDividerElement = ({ attributes }: RenderDividerElementProps) => (
  <div {...attributes} className="qdr-divider" contentEditable={false}>
    <hr />
  </div>
);
