import React from 'react';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = ({ children, element }: JsxSerializeFootnoteElementProps) => (
  <>
    <a href="./#">{children}</a>
    <sup style={{ color: 'var(--qdr-sup)' }}>
      {`[${element.index ?? 1}]`}
    </sup>
  </>
);
