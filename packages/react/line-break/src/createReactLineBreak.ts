import isHotkey from 'is-hotkey';

import { createLineBreak, CreateHLineBreakOptions } from '@quadrats/common/line-break';
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

  console.log({ type });

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
            console.log({ hotKey: 'shift+enter' });

            try {
              // Transforms.insertNodes(editor, [{ type: 'p', children: [{ text: '' }] }]);
              core.toggleLineBreakNodes(editor, type);
              // event.preventDefault();

              // 換行邏輯

              // eslint-disable-next-line no-empty
            } catch {}
          } else {
            onKeyDownBreak(event, editor, next);
          }
        },
      };
    },
    createRenderElement: ({ render = defaultRenderLineBreakElement } = {}) => createRenderElement({ type, render }),
  };
}
