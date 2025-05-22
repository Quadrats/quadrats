import { useSlateStatic } from '@quadrats/react';
import { ReactAccordion } from '@quadrats/react/accordion';

export function useAccordionTool(controller: ReactAccordion) {
  const editor = useSlateStatic();

  return {
    onClick: () => controller.insertAccordion(editor),
  };
}
