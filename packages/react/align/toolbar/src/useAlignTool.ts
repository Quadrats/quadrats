import { useQuadrats } from '@quadrats/react';
import { ReactAlign } from '@quadrats/react/align';
import { AlignValue } from '@quadrats/common/align';

export function useAlignTool(controller: ReactAlign, value: AlignValue) {
  const editor = useQuadrats();

  return {
    active: controller.isAlignActive(editor, value),
    onClick: () => {
      if (controller.isAlignActive(editor, value)) {
        controller.removeAlign(editor);
      } else {
        controller.setAlign(editor, value);
      }
    },
  };
}
