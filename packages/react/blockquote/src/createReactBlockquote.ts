import isHotkey from 'is-hotkey';
import { CreateBlockquoteOptions, createBlockquote } from '@quadrats/common/blockquote';
import { createRenderElement } from '@quadrats/react';
import { COMMON_SOFT_BREAK_HOTKEY, createOnKeyDownBreak } from '@quadrats/react/line-break';
import { ReactBlockquote } from './typings';
import { BLOCKQUOTE_HOTKEY } from './constants';
import { defaultRenderBlockquoteElement } from './defaultRenderBlockquoteElement';
import {
  Editor,
  getNodesByTypes,
  ParagraphElement,
  PARAGRAPH_TYPE,
  QuadratsText,
  Transforms,
  Path,
} from '@quadrats/core';

export type CreateReactBlockquoteOptions = CreateBlockquoteOptions;

export const BLOCKQUOTE_EXIT_BREAK_HOTKEY = 'enter';

export function createReactBlockquote(options: CreateReactBlockquoteOptions = {}): ReactBlockquote {
  const core = createBlockquote(options);
  const { type } = core;
  const onKeyDownBreak = createOnKeyDownBreak({
    exitBreak: {
      rules: [
        {
          hotkey: BLOCKQUOTE_EXIT_BREAK_HOTKEY,
          match: {
            includeTypes: [type],
          },
        },
      ],
    },
    softBreak: {
      rules: [
        {
          hotkey: COMMON_SOFT_BREAK_HOTKEY,
          match: {
            includeTypes: [type],
          },
        },
      ],
    },
  });

  return {
    ...core,
    createHandlers: ({ hotkey = BLOCKQUOTE_HOTKEY } = {}) => ({
      onKeyDown: (event, editor, next) => {
        if (isHotkey(hotkey, event)) {
          core.toggleBlockquote(editor);
        } else {
          if (editor.selection) {
            const [highestIsQuote] = getNodesByTypes(editor, [type], { mode: 'highest' });
            const [selectInParagraph] = getNodesByTypes(editor, [PARAGRAPH_TYPE], { at: editor.selection });

            if (isHotkey(BLOCKQUOTE_EXIT_BREAK_HOTKEY, event)) {
              if (highestIsQuote && selectInParagraph) {
                const [, quotePath] = highestIsQuote;
                const isEnd = Editor.isEnd(editor, Editor.point(editor, editor.selection), quotePath);

                const [paragraphNode] = selectInParagraph;
                const text = ((paragraphNode as ParagraphElement).children[0] as QuadratsText).text;
                const isEmptyParagraph = text.length === 0;

                // move out the empty paragraph if end of the quote
                if (isEnd && isEmptyParagraph) {
                  event.preventDefault();
                  const moveto = quotePath.slice();

                  moveto[quotePath.length - 1] += 1;
                  Transforms.moveNodes(editor, {
                    at: editor.selection,
                    to: moveto,
                  });

                  return;
                }
              }
            } else if (event.key === 'Backspace') {
              if (highestIsQuote && selectInParagraph) {
                const [, quotePath] = highestIsQuote;
                const [paragraphNode, currentPath] = selectInParagraph;
                const isFirst = Path.equals(currentPath, quotePath.concat(0));
                const text = ((paragraphNode as ParagraphElement).children[0] as QuadratsText).text;

                if (isFirst && !text) {
                  event.preventDefault();
                  core.toggleBlockquote(editor);

                  return;
                }
              }
            }
          }

          onKeyDownBreak(event, editor, next);
        }
      },
    }),
    createRenderElement: ({ render = defaultRenderBlockquoteElement } = {}) => createRenderElement({ type, render }),
  };
}
