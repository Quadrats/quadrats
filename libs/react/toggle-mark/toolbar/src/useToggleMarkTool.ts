import { useQuadrats } from '@quadrats/react';
import { ReactToggleMark } from '@quadrats/react/toggle-mark';

export function useToggleMarkTool(controller: ReactToggleMark) {
  const editor = useQuadrats();

  return {
    active: controller.isToggleMarkActive(editor),
    onClick: () => controller.toggleMark(editor),
  };
}
