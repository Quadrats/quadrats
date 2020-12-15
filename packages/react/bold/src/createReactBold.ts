import { createBold } from '@quadrats/common/bold';
import { createReactToggleMarkCreator } from '@quadrats/react/toggle-mark';
import { BOLD_HOTKEY } from './constants';
import { defaultRenderBold } from './defaultRenderBold';

export const createReactBold = createReactToggleMarkCreator(createBold, {
  hotkey: BOLD_HOTKEY,
  render: defaultRenderBold,
});
