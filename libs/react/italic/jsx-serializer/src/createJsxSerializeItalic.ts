import { ITALIC_TYPE } from '@quadrats/common/italic';
import { createJsxSerializeToggleMarkCreator } from '@quadrats/react/toggle-mark/jsx-serializer';
import { defaultRenderItalic } from './defaultRenderItalic';

export const createJsxSerializeItalic = createJsxSerializeToggleMarkCreator({
  type: ITALIC_TYPE,
  render: defaultRenderItalic,
});
