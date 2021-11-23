import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderBold = (variant?: string) => (
  ({ children }: RenderMarkPropsBase<boolean>) => (
    <strong className={variant ?? ''}>
      {children}
    </strong>
  )
);
