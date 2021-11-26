import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { getVariantType } from '@quadrats/core';
import { UNDERLINE_TYPE } from './constants';

export const createUnderline = (variant?: string) => createToggleMarkCreator({
  type: getVariantType(UNDERLINE_TYPE, variant),
  parentType: UNDERLINE_TYPE,
});
