import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { HIGHLIGHT_TYPE } from './constants';

export const createHighlight = (variant?: string) => createToggleMarkCreator({
  type: HIGHLIGHT_TYPE,
  variant,
});
