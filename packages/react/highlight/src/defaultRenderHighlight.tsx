import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderHighlight = (variant?: string) => (
  ({ children }: RenderMarkPropsBase<boolean>) => (
    <mark className={variant ?? ''}>
      {children}
    </mark>
  )
);
