import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { ITALIC_TYPE } from './constants';
import { Editor } from '@quadrats/core';

export function createItalic<E extends Editor = Editor>(variant?: string) {
  return createToggleMarkCreator<E>({
    type: ITALIC_TYPE,
    variant,
  });
}
