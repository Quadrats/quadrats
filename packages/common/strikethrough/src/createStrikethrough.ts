import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { STRIKETHROUGH_TYPE } from './constants';
import { Editor } from '@quadrats/core';

export function createStrikethrough<E extends Editor = Editor>(variant?: string) {
  return createToggleMarkCreator<E>({
    type: STRIKETHROUGH_TYPE,
    variant,
  });
}
