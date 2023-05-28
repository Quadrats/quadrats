import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { UNDERLINE_TYPE } from './constants';
import { Editor } from '@quadrats/core';

export function createUnderline<E extends Editor = Editor>(variant?: string) {
  return createToggleMarkCreator<E>({
    type: UNDERLINE_TYPE,
    variant,
  });
}
