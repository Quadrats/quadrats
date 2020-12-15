import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { BOLD_TYPE } from './constants';

export const createBold = createToggleMarkCreator({
  type: BOLD_TYPE,
});
