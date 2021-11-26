import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { getVariantType } from '@quadrats/core';
import { BOLD_TYPE } from './constants';

export const createBold = (variant?: string) => createToggleMarkCreator({
  type: getVariantType(BOLD_TYPE, variant),
  parentType: BOLD_TYPE,
});
