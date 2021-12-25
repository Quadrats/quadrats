import { useSlateStatic } from '@quadrats/react';
import { ReactDivider } from '@quadrats/react/divider';

export function useDividerTool(controller: ReactDivider) {
  const editor = useSlateStatic();

  return {
    onClick: () => controller.insertDivider(editor),
  };
}
