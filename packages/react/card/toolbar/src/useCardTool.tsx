import { useEffect } from 'react';
import { useSlateStatic, useModal } from '@quadrats/react';
import { ReactCard } from '@quadrats/react/card';

export function useCardTool(controller: ReactCard) {
  const editor = useSlateStatic();
  const { setCardModalConfig, isModalClosed, setIsModalClosed } = useModal();

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
    },
  };
}
