import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { BOLD_TYPE } from './constants';
import { Editor } from '@quadrats/core';

export function createBold<E extends Editor = Editor>(variant?: string) {
  return createToggleMarkCreator<E>({
    type: BOLD_TYPE,
    variant,
  });
}
