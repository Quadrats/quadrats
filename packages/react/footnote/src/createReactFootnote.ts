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
      const { insertData, insertText } = editor;

      editor.insertData = (data) => {
        const text = data.getData('text/plain');

        if (text) {
          if (core.isSelectionInFootnote(editor)) {
            insertText(text);
            return;
          }
        }

        insertData(data);
      };

      return core.with(editor);
    },
  };
}
