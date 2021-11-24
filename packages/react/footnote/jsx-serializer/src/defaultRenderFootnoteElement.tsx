import React from 'react';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = ({ children, element }: JsxSerializeFootnoteElementProps) => (
  <a href="./#">
    {`${children}[${element.footnote}]`}
  </a>
);
