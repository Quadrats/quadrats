import { createLineBreak, CreateLineBreakOptions } from '@quadrats/core';
import { createRenderElement } from '@quadrats/react';
import { COMMON_ON_KEY_DOWN_BREAK } from './commonBreak';
import { defaultRenderLineBreakElement } from './defaultRenderLineBreakElement';
import { ReactBreak } from './typings';

export type CreateReactLineBreakOptions = CreateLineBreakOptions;

export function createReactLineBreak(options: CreateReactLineBreakOptions = {}): ReactBreak {
  const core = createLineBreak(options);
  const { type } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown: COMMON_ON_KEY_DOWN_BREAK,
    }),
    createRenderElement: ({ render = defaultRenderLineBreakElement } = {}) => createRenderElement({ type, render }),
  };
}
