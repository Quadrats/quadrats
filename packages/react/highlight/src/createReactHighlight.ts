import { createHighlight } from '@quadrats/common/highlight';
import { createReactToggleMarkCreator } from '@quadrats/react/toggle-mark';
import { defaultRenderHighlight } from './defaultRenderHighlight';
import { HIGHLIGHT_HOTKEY } from './constants';

export const createReactHighlight = (variant?: string) => createReactToggleMarkCreator(
  createHighlight(variant), {
    hotkey: HIGHLIGHT_HOTKEY,
    render: defaultRenderHighlight(variant),
  },
)();
