import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { STRIKETHROUGH_TYPE } from './constants';

export const createStrikethrough = (variant?: string) => createToggleMarkCreator({
  type: STRIKETHROUGH_TYPE,
  variant,
});
