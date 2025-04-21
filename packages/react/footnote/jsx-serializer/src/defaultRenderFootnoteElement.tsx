import React from 'react';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = ({ children, element }: JsxSerializeFootnoteElementProps) => (
  <>
    <span className="qdr-footnote-text" style={{ textDecoration: 'underline' }}>
      {children}
    </span>
    <sup className="qdr-footnote-sup" style={{ color: 'var(--qdr-error-light)' }}>{`[${element.index ?? 1}]`}</sup>
  </>
);
