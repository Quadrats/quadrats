import React from 'react';
import { Tooltip } from '@quadrats/react/components';
import { RenderFootnoteElementProps } from './typings';

/**
 * Set placement of tooltip to `bottom` to avoid conflicting w/ toolbar.
 */
export const defaultRenderFootnoteElement = ({
  attributes,
  children,
  element,
  placement = 'bottom',
}: RenderFootnoteElementProps & {
  placement?: 'top' | 'bottom';
  target?: string;
}) => {
  const { footnote, index } = element;

  return (
    <>
      <Tooltip placement={placement} popup={footnote}>
        <span style={{ textDecoration: 'underline' }} {...attributes} className="qdr-footnote-text">
          {children}
        </span>
      </Tooltip>
      <sup
        {...attributes}
        className="qdr-footnote-sup"
        style={{ color: 'var(--qdr-error-light)', userSelect: 'none' }}
        contentEditable={false}
      >
        {`[${index ?? 1}]`}
      </sup>
    </>
  );
};
