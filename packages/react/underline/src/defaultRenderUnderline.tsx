import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderUnderline = (variant?: string) => (
  ({ children }: RenderMarkPropsBase<boolean>) => (
    <u className={variant ?? ''}>
      {children}
    </u>
  )
);
