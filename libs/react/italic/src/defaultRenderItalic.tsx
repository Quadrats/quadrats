import React from 'react';
import { ITALIC_TYPE } from '@quadrats/common/italic';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';
import { ItalicLeaf } from './typings';

export const defaultRenderItalic = ({ children, leaf }: RenderMarkPropsBase<boolean>) => (
  <i className={(leaf as ItalicLeaf).italicVariant
    ? `${ITALIC_TYPE}.${(leaf as ItalicLeaf).italicVariant}` : `${ITALIC_TYPE}`}
  >
    {children}
  </i>
);
