import { createUnderline } from '@quadrats/common/underline';
import { createReactToggleMarkCreator } from '@quadrats/react/toggle-mark';
import { defaultRenderUnderline } from './defaultRenderUnderline';
import { UNDERLINE_HOTKEY } from './constants';

export const createReactUnderline = createReactToggleMarkCreator(createUnderline, {
  hotkey: UNDERLINE_HOTKEY,
  render: defaultRenderUnderline,
});
