import { InputWidgetConfig } from '@quadrats/common/input-widget';
import { Editor, useSlateStatic } from '@quadrats/react';
import { ReactEmbed } from '@quadrats/react/embed';
import { StartToolInput, useStartToolInput } from '@quadrats/react/toolbar';

export function useEmbedTool<P extends string>(
  controller: ReactEmbed<P>,
  providers: P[],
  getPlaceholder: InputWidgetConfig['getPlaceholder'],
  startToolInput?: (editor: Editor, inputConfig: InputWidgetConfig) => void,
) {
  const editor = useSlateStatic();
  const defaultStartToolInput = useStartToolInput();
  const start: StartToolInput = startToolInput
    ? inputConfig => startToolInput(editor, inputConfig)
    : defaultStartToolInput;

  return {
    onClick: () => start({
      getPlaceholder,
      confirm: embedCode => controller.insertEmbed(editor, providers, embedCode),
    }),
  };
}
