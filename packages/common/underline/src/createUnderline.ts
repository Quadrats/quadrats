import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { UNDERLINE_TYPE } from './constants';

export const createUnderline = createToggleMarkCreator({
  type: UNDERLINE_TYPE,
});
