import { LinkUpsertLinkOptions } from '@quadrats/common/link';
import { useQuadrats } from '@quadrats/react';
import { ReactLink } from '@quadrats/react/link';
import { useStartToolInput } from '@quadrats/react/toolbar';

export type UseLinkToolOptions = LinkUpsertLinkOptions;

export function useLinkTool(controller: ReactLink, options: UseLinkToolOptions = {}) {
  const editor = useQuadrats();
  const startToolInput = useStartToolInput();

  return {
    active: controller.isSelectionInLink(editor),
    onClick: () => startToolInput({
      getPlaceholder: locale => locale.editor.link.inputPlaceholder,
      confirm: (url) => {
        const urlValidation = /^http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;

        if (!urlValidation.test(url)) {
          window.alert('請輸入正確的網址格式');

          return;
        }

        if (controller.isUrl(url)) {
          controller.upsertLink(editor, url, options);
        }
      },
    }),
  };
}
