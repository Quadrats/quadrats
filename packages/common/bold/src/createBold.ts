import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { BOLD_TYPE } from './constants';

export const createBold = (variant?: string) => createToggleMarkCreator({
  type: BOLD_TYPE,
  variant,
});
