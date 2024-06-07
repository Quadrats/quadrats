import { createItalic } from '@quadrats/common/italic';
import { createReactToggleMarkCreator } from '@quadrats/react/toggle-mark';
import { defaultRenderItalic } from './defaultRenderItalic';
import { ITALIC_HOTKEY } from './constants';

export const createReactItalic = (variant?: string) => createReactToggleMarkCreator(
  createItalic(variant), {
    hotkey: ITALIC_HOTKEY,
    render: defaultRenderItalic,
  },
)();
