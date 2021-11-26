import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderItalic = (variant?: string) => (
  ({ children }: RenderMarkPropsBase<boolean>) => (
    <i className={variant ?? ''}>
      {children}
    </i>
  )
);
