import React from 'react';
import { STRIKETHROUGH_TYPE } from '@quadrats/common/strikethrough';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';
import { StrikethroughLeaf } from './typings';

export const defaultRenderStrikethrough = ({ children, leaf }: RenderMarkPropsBase<boolean>) => (
  <del className={(leaf as StrikethroughLeaf).strikethroughVariant
    ? `${STRIKETHROUGH_TYPE}.${leaf.strikethroughVariant}` : `${STRIKETHROUGH_TYPE}`}
  >
    {children}
  </del>
);
