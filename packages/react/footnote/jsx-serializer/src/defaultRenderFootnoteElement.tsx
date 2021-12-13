import React from 'react';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = ({ children, element }: JsxSerializeFootnoteElementProps) => (
  <>
    <span style={{ textDecoration: 'underline' }}>{children}</span>
    <sup style={{ color: 'var(--qdr-sup)' }}>
      {`[${element.index ?? 1}]`}
    </sup>
  </>
);
