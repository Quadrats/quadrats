import { createRenderElement } from '@quadrats/react';
import {
  WithElementType,
} from '@quadrats/core';
import { createFootnote } from '@quadrats/common/footnote';
import { ReactFootnote } from './typings';
import { defaultRenderFootnoteElement } from './defaultRenderFootnoteElement';
// import { FOOTNOTE_HOTKEY } from './constants';

export interface CreateReactFootnoteOptions extends Partial<WithElementType> {
  /**
   * The types of void elements can be wrapped by footnote.
   * Let footnote be block element if wrap some wrappable blocks.
   */
  wrappableVoidTypes?: string[];
}

export function createReactFootnote(options: CreateReactFootnoteOptions = {}): ReactFootnote {
  const core = createFootnote(options);
  const { type } = core;

  return {
    ...core,
    // createHandlers: ({ hotkey = FOOTNOTE_HOTKEY } = {}) => ({
    //   onKeyDown: (event, editor, next) => {
    //     if (isHotkey(hotkey, event as any)) {
    //       // core.toggleBlockquote(editor);
    //     } else {
    //       onKeyDownBreak(event, editor, next);
    //     }
    //   },
    // }),
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
