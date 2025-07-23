import { useEffect } from 'react';
import { Editor, Element } from '@quadrats/core';
import { CARD_PLACEHOLDER_TYPE, CardPlaceholderElement } from '@quadrats/common/card';
import { useSlateStatic, useModal } from '@quadrats/react';
import { ReactCard } from '@quadrats/react/card';

// TODO: i18n
export function useCardTool(controller: ReactCard) {
  const editor = useSlateStatic();
  const { setCardModalConfig, isModalClosed, setIsModalClosed } = useModal();

  useEffect(() => {
    const [match] = Editor.nodes(editor, {
      at: [],
      match: (node) => {
        const placeholderElement = node as CardPlaceholderElement;

        return Element.isElement(placeholderElement) && placeholderElement.type === CARD_PLACEHOLDER_TYPE;
      },
    });

    if (match) {
      setCardModalConfig({
        confirmText: '建立卡片',
        onConfirm: () => {
          controller.removeCardPlaceholder(editor);
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, editor]);

  useEffect(() => {
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeCardPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, editor, isModalClosed, setIsModalClosed]);

  return {
    onClick: () => {
      controller.insertCardPlaceholder(editor);
    },
  };
}
