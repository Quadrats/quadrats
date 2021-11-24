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
        <span {...attributes}>
          {children}
        </span>
      </Tooltip>
      <span
        style={{ userSelect: 'none' }}
        contentEditable={false}
      >
        {`[${index ?? 1}]`}
      </span>
    </>
  );
};
