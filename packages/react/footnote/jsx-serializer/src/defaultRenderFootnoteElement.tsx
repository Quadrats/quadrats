import React from 'react';
import { Tooltip } from '@quadrats/react/components';
import { JsxSerializeFootnoteElementProps } from './typings';

export const defaultRenderFootnoteElement = (
  { children, element, placement = 'bottom' }: JsxSerializeFootnoteElementProps & {
    placement?: 'top' | 'bottom';
  },
) => (
  <>
    <Tooltip placement={placement} popup={element.footnote}>
      <span className="qdr-footnote-text" style={{ textDecoration: 'underline' }}>
        {children}
      </span>
    </Tooltip>
    <sup className="qdr-footnote-sup" style={{ color: 'var(--qdr-error-light)' }}>{`[${element.index ?? 1}]`}</sup>
  </>
);
