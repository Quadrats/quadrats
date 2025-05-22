import React from 'react';
import { RenderAccordionElementProps } from './typings';

export const defaultRenderAccordionElement = ({ attributes, children }: RenderAccordionElementProps) => (
  <div {...attributes} className="qdr-accordion" contentEditable={false}>
    accordion
    {children}
  </div>
);
