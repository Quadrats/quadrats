import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderHighlight = ({ children }: RenderMarkPropsBase<boolean>) => <mark>{children}</mark>;
