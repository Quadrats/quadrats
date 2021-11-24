import { FootnoteUpsertFootnoteOptions } from '@quadrats/common/footnote';
import { useQuadrats } from '@quadrats/react';
import { ReactFootnote } from '@quadrats/react/footnote';
import { useStartToolInput } from '@quadrats/react/toolbar';

export type UseFootnoteToolOptions = FootnoteUpsertFootnoteOptions;

export function useFootnoteTool(controller: ReactFootnote, options: UseFootnoteToolOptions = {}) {
  const editor = useQuadrats();
  const startToolInput = useStartToolInput();

  return {
    active: controller.isSelectionInFootnote(editor),
    onClick: () => startToolInput({
      getPlaceholder: (locale) => locale.editor.footnote.inputPlaceholder,
      confirm: (footnoteText) => {
        controller.upsertFootnoteAndUpdateIndex(editor, footnoteText, options);
      },
    }),
  };
}
