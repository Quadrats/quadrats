import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';
import { UNDERLINE_TYPE } from '@quadrats/common/underline';
import { UnderlineLeaf } from './typings';

export const defaultRenderUnderline = ({ children, leaf }: RenderMarkPropsBase<boolean>) => (
  <u className={(leaf as UnderlineLeaf).underlineVariant
    ? `${UNDERLINE_TYPE}.${leaf.underlineVariant}` : `${UNDERLINE_TYPE}`}
  >
    {children}
  </u>
);
