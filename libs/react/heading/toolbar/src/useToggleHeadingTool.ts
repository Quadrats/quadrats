import { HeadingLevel } from '@quadrats/common/heading';
import { useQuadrats } from '@quadrats/react';
import { ReactHeading } from '@quadrats/react/heading';

export function useToggleHeadingTool<Level extends HeadingLevel, ValidLevel extends Level>(
  controller: ReactHeading<Level>,
  level: ValidLevel,
) {
  const editor = useQuadrats();

  return {
    active: controller.isSelectionInHeading(editor, level),
    onClick: () => controller.toggleHeadingNodes(editor, level),
  };
}
