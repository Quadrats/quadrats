import { HIGHLIGHT_TYPE } from '@quadrats/common/highlight';
import { createJsxSerializeToggleMarkCreator } from '@quadrats/react/toggle-mark/jsx-serializer';
import { defaultRenderHighlight } from './defaultRenderHighlight';

export const createJsxSerializeHighlight = createJsxSerializeToggleMarkCreator({
  type: HIGHLIGHT_TYPE,
  render: defaultRenderHighlight(),
});
