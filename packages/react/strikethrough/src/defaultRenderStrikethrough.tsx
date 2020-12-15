import React from 'react';
import { RenderMarkPropsBase } from '@quadrats/react/_internal';

export const defaultRenderStrikethrough = ({ children }: RenderMarkPropsBase<boolean>) => <del>{children}</del>;
