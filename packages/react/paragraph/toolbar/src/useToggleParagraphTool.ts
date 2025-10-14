import { Paragraph } from '@quadrats/common/paragraph';
import { useQuadrats } from '@quadrats/react';

export function useToggleParagraphTool(controller: Paragraph) {
  const editor = useQuadrats();

  return {
    active: controller.isSelectionInParagraph(editor),
    onClick: () => controller.setParagraphNodes(editor),
  };
}
