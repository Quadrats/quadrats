import { useSlateStatic } from '@quadrats/react';
import { ReactLink } from '@quadrats/react/link';

export function useUnlinkTool(controller: ReactLink) {
  const editor = useSlateStatic();

  return {
    onClick: () => controller.unwrapLink(editor),
  };
}
