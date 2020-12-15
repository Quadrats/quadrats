import { createToggleMarkCreator } from '@quadrats/common/toggle-mark';
import { ITALIC_TYPE } from './constants';

export const createItalic = createToggleMarkCreator({
  type: ITALIC_TYPE,
});
