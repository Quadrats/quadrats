import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { getVariantType } from '@quadrats/core';
import { ITALIC_TYPE } from './constants';

export const createItalic = (variant?: string) => createToggleMarkCreator({
  type: getVariantType(ITALIC_TYPE, variant),
  parentType: ITALIC_TYPE,
});
