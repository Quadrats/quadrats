import { createDivider, CreateDividerOptions } from '@quadrats/common/divider';
import { createRenderElement } from '@quadrats/react';
import { defaultRenderDividerElement } from './defaultRenderDividerElement';
import { ReactDivider } from './typings';

export type CreateReactDividerOptions = CreateDividerOptions;

export function createReactDivider(options: CreateReactDividerOptions = {}): ReactDivider {
  const core = createDivider(options);
  const { type } = core;

  return {
    ...core,
    createRenderElement: ({ render = defaultRenderDividerElement } = {}) => createRenderElement({ type, render }),
  };
}
