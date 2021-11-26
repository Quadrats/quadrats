import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderStrikethrough = (variant?: string) => (
  ({ children }: RenderMarkPropsBase<boolean>) => (
    <del className={variant ?? ''}>
      {children}
    </del>
  )
);
