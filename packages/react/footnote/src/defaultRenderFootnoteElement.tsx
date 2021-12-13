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
        <span style={{ textDecoration: 'underline' }} {...attributes}>
          {children}
        </span>
      </Tooltip>
      <sup
        {...attributes}
        style={{ color: 'var(--qdr-sup)', userSelect: 'none' }}
        contentEditable={false}
      >
        {`[${index ?? 1}]`}
      </sup>
    </>
  );
};
