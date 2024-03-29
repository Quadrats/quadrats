import { createStrikethrough } from '@quadrats/common/strikethrough';
import { createReactToggleMarkCreator } from '@quadrats/react/toggle-mark';
import { defaultRenderStrikethrough } from './defaultRenderStrikethrough';
import { STRIKETHROUGH_HOTKEY } from './constants';

export const createReactStrikethrough = (variant?: string) => createReactToggleMarkCreator(
  createStrikethrough(variant), {
    hotkey: STRIKETHROUGH_HOTKEY,
    render: defaultRenderStrikethrough,
  },
)();
