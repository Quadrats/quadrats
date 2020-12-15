import { useQuadrats } from '@quadrats/react';
import { ReactBlockquote } from '@quadrats/react/blockquote';

export function useBlockquoteTool(controller: ReactBlockquote) {
  const editor = useQuadrats();

  return {
    active: controller.isSelectionInBlockquote(editor),
    onClick: () => controller.toggleBlockquote(editor),
  };
}
