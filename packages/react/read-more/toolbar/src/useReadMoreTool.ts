import { useEditor } from '@quadrats/react';
import { ReactReadMore } from '@quadrats/react/read-more';

export function useReadMoreTool(controller: ReactReadMore) {
  const editor = useEditor();

  return {
    onClick: () => controller.insertReadMore(editor),
  };
}
