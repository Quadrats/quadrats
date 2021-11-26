import { BOLD_TYPE } from '@quadrats/common/bold';
import { createJsxSerializeToggleMarkCreator } from '@quadrats/react/toggle-mark/jsx-serializer';
import { defaultRenderBold } from './defaultRenderBold';

export const createJsxSerializeBold = createJsxSerializeToggleMarkCreator({
  type: BOLD_TYPE,
  render: defaultRenderBold(),
});
