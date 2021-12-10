import { UNDERLINE_TYPE } from '@quadrats/common/underline';
import { createJsxSerializeToggleMarkCreator } from '@quadrats/react/toggle-mark/jsx-serializer';
import { defaultRenderUnderline } from './defaultRenderUnderline';

export const createJsxSerializeUnderline = createJsxSerializeToggleMarkCreator({
  type: UNDERLINE_TYPE,
  render: defaultRenderUnderline,
});
