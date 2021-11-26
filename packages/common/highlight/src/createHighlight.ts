import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { getVariantType } from '@quadrats/core';
import { HIGHLIGHT_TYPE } from './constants';

export const createHighlight = (variant?: string) => createToggleMarkCreator({
  type: getVariantType(HIGHLIGHT_TYPE, variant),
  parentType: HIGHLIGHT_TYPE,
});
