import React from 'react';
import { BOLD_TYPE } from '@quadrats/common/bold';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';
import { BoldLeaf } from './typings';

export const defaultRenderBold = ({ children, leaf }: RenderMarkPropsBase<boolean>) => (
  <strong className={(leaf as BoldLeaf).boldVariant
    ? `${BOLD_TYPE}.${(leaf as BoldLeaf).boldVariant}` : `${BOLD_TYPE}`}
  >
    {children}
  </strong>
);
