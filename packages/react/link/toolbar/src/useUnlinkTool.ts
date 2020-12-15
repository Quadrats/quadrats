import { useEditor } from '@quadrats/react';
import { ReactLink } from '@quadrats/react/link';

export function useUnlinkTool(controller: ReactLink) {
  const editor = useEditor();

  return {
    onClick: () => controller.unwrapLink(editor),
  };
}
