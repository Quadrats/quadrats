import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';
import { HIGHLIGHT_TYPE } from '@quadrats/common/highlight';
import { HighlightLeaf } from './typings';

export const defaultRenderHighlight = (variant?: string) => ({ children, leaf }: RenderMarkPropsBase<boolean>) => (
  <mark data-type={variant ?? undefined} className={(leaf as HighlightLeaf).highlightVariant
    ? `${HIGHLIGHT_TYPE}.${(leaf as HighlightLeaf).highlightVariant}` : `${HIGHLIGHT_TYPE}`}
  >
    {children}
  </mark>
);
