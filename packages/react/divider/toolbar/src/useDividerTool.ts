import { useEditor } from '@quadrats/react';
import { ReactDivider } from '@quadrats/react/divider';

export function useDividerTool(controller: ReactDivider) {
  const editor = useEditor();

  return {
    onClick: () => controller.insertDivider(editor),
  };
}
