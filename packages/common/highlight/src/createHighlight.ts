import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { HIGHLIGHT_TYPE } from './constants';
import { Editor } from '@quadrats/core';

export function createHighlight<E extends Editor = Editor>(variant?: string) {
  return createToggleMarkCreator<E>({
    type: HIGHLIGHT_TYPE,
    variant,
  });
}
