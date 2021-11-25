import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';

import { createLineBreak, CreateHLineBreakOptions, LINE_BREAK_TYPE } from '@quadrats/common/line-break';
import { createRenderElement } from '@quadrats/react';
import { createOnKeyDownBreak } from '@quadrats/react/break';
import { ReactLineBreak } from './typings';
import { LINE_BREAK_HOTKEY } from './constants';
import { defaultRenderLineBreakElement } from './defaultRenderLineBreakElement';

export function createReactLineBreak(
  options: CreateHLineBreakOptions = {},
): ReactLineBreak {
  const core = createLineBreak(options);
  const { type } = core;

  return {
    ...core,
    createHandlers: ({ hotkey = LINE_BREAK_HOTKEY } = {}) => {
      const onKeyDownBreak = createOnKeyDownBreak({
        exitBreak: {
          rules: [
            {
              hotkey: 'enter',
              match: {
                onlyAtEdge: true,
                includeTypes: [type],
              },
            },
          ],
        },
      });

      return {
        onKeyDown(event, editor, next) {
          /**
           * Only toggle if the hotkey is fired and the key is the same as level.
           */
          if (isHotkey(hotkey, event as any)) {
            try {
              event.preventDefault();
              core.toggleLineBreakNodes(editor, type);

              // eslint-disable-next-line no-empty
            } catch {}
          } else if (isHotkey(['Backspace', 'Meta+Backspace', 'ctrl+Backspace'], event as any)) {
            const start = editor.selection?.focus?.path?.[0] ?? 0;

            Transforms.removeNodes(editor, {
              at: [start],
              match: (node) => node.type === LINE_BREAK_TYPE,
            });
          } else {
            const start = editor.selection?.focus?.path?.[0] ?? 0;

            Transforms.moveNodes(editor, {
              at: [start],
              to: [start, 15],
              match: (node) => node.type === LINE_BREAK_TYPE,
            });

            onKeyDownBreak(event, editor, next);
          }
        },
      };
    },
    createRenderElement: ({ render = defaultRenderLineBreakElement } = {}) => createRenderElement({ type, render }),
  };
}
