import React from 'react';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = ({ children, element }: JsxSerializeFootnoteElementProps) => (
  <span>
    {`${children}[${element.footnote}]`}
  </span>
);
