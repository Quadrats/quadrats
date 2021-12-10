import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { UNDERLINE_TYPE } from './constants';

export const createUnderline = (variant?: string) => createToggleMarkCreator({
  type: UNDERLINE_TYPE,
  variant,
});
