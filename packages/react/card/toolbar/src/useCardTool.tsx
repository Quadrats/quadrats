import { useEffect } from 'react';
import { Editor, Element } from '@quadrats/core';
import { CARD_PLACEHOLDER_TYPE, CardPlaceholderElement } from '@quadrats/common/card';
import { useSlateStatic, useModal } from '@quadrats/react';
import { ReactCard } from '@quadrats/react/card';

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
        controller,
        onConfirm: ({ values, imageItem, haveLink }) => {
          controller.removeCardPlaceholder(editor);
          controller.insertCard({
            editor,
            cardValues: {
              alignment: values.alignment,
              imageItem,
              title: values.title,
              description: values.description,
              remark: values.remark,
              haveLink,
              linkText: values.linkText,
              linkUrl: values.linkUrl,
            },
          });
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
