import isHotkey from 'is-hotkey';
import { createAlign } from '@quadrats/common/align';
import { ALIGN_LEFT_HOTKEY, ALIGN_CENTER_HOTKEY, ALIGN_RIGHT_HOTKEY } from './constants';
import { ReactAlign } from './typings';

export function createReactAlign(): ReactAlign {
  const core = createAlign();

  return {
    ...core,
    createHandlers: ({ hotkeys = {} } = {}) => ({
      onKeyDown: (event, editor, next) => {
        const { left = ALIGN_LEFT_HOTKEY, center = ALIGN_CENTER_HOTKEY, right = ALIGN_RIGHT_HOTKEY } = hotkeys;

        if (isHotkey(left, event)) {
          core.setAlign(editor, 'left');
        } else if (isHotkey(center, event)) {
          core.setAlign(editor, 'center');
        } else if (isHotkey(right, event)) {
          core.setAlign(editor, 'right');
        } else {
          next();
        }
      },
    }),
  };
}
