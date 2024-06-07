import { createRenderElement } from '@quadrats/react';
import {
  WithElementType,
} from '@quadrats/core';
import { createFootnote } from '@quadrats/common/footnote';
import { ReactFootnote } from './typings';
import { defaultRenderFootnoteElement } from './defaultRenderFootnoteElement';

export type CreateReactFootnoteOptions = Partial<WithElementType>;

export function createReactFootnote(options: CreateReactFootnoteOptions = {}): ReactFootnote {
  const core = createFootnote(options);
  const { type } = core;

  return {
    ...core,
    createRenderElement: ({ render = defaultRenderFootnoteElement } = {}) => createRenderElement({ type, render }),
    with(editor) {
      return core.with(editor);
    },
  };
}
