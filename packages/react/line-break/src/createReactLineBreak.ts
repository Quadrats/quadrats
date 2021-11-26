import isHotkey from 'is-hotkey';
import { Transforms } from 'slate';

import { createLineBreak, CreateHLineBreakOptions, LineBreakVariant } from '@quadrats/common/line-break';
import { createRenderElement } from '@quadrats/react';
import { createOnKeyDownBreak } from '@quadrats/react/break';

import { ReactLineBreak } from './typings';
import { defaultRenderLineBreakElement } from './defaultRenderLineBreakElement';
import { LINE_BREAK_HOTKEY, LINE_BREAK_INITIAL_HOT_KEYS, LINE_BREAK_SHIFT_HOTKEY } from './constants';

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
          const isActive = core.isSelectionInLineBreak(editor);
          /**
           * Only toggle if the hotkey is fired and the key is the same as level.
           */
          if (isHotkey(hotkey, event as any)) {
            try {
              event.preventDefault();
              core.toggleLineBreakNodes(editor, LineBreakVariant.ENTER);

              // eslint-disable-next-line no-empty
            } catch {}
          } else if (isHotkey(LINE_BREAK_SHIFT_HOTKEY, event as any)) {
            try {
              event.preventDefault();
              core.toggleLineBreakNodes(editor, LineBreakVariant.SHIFT_ENTER);

              // eslint-disable-next-line no-empty
            } catch {}
          } else if (
            isHotkey(LINE_BREAK_INITIAL_HOT_KEYS, event as any)
            && isActive
          ) {
            const start = editor.selection?.focus?.path?.[0] ?? 0;

            Transforms.removeNodes(editor, {
              at: [start],
              match: (node) => node.type === type,
            });
          } else {
            if (isActive) {
              const start = editor.selection?.focus?.path?.[0] ?? 0;

              Transforms.moveNodes(editor, {
                at: [start],
                to: [start, 15],
                match: (node) => node.type === type,
              });
            }

            onKeyDownBreak(event, editor, next);
          }
        },
      };
    },
    createRenderElement: ({ render = defaultRenderLineBreakElement } = {}) => createRenderElement({ type, render }),
  };
}
