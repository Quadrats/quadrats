import { STRIKETHROUGH_TYPE } from '@quadrats/common/strikethrough';
import { createJsxSerializeToggleMarkCreator } from '@quadrats/react/toggle-mark/jsx-serializer';
import { defaultRenderStrikethrough } from './defaultRenderStrikethrough';

export const createJsxSerializeStrikethrough = createJsxSerializeToggleMarkCreator({
  type: STRIKETHROUGH_TYPE,
  render: defaultRenderStrikethrough,
});
