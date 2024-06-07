import { useSlateStatic } from '@quadrats/react';
import { ReactReadMore } from '@quadrats/react/read-more';

export function useReadMoreTool(controller: ReactReadMore) {
  const editor = useSlateStatic();

  return {
    onClick: () => controller.insertReadMore(editor),
  };
}
