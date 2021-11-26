import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { getVariantType } from '@quadrats/core';
import { STRIKETHROUGH_TYPE } from './constants';

export const createStrikethrough = (variant?: string) => createToggleMarkCreator({
  type: getVariantType(STRIKETHROUGH_TYPE, variant),
  parentType: STRIKETHROUGH_TYPE,
});
