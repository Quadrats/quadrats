import { useQuadrats } from '@quadrats/react';
import { ReactLineBreak } from '@quadrats/react/line-break';

export function useToggleLineBreakTool(
  controller: ReactLineBreak,
) {
  const editor = useQuadrats();

  return {
    active: controller.isSelectionInLineBreak(editor),
    onClick: () => controller.toggleLineBreakNodes(editor),
  };
}
