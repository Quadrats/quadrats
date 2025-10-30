import { useEffect } from 'react';
import { useSlateStatic, useModal } from '@quadrats/react';
import { ReactCarousel } from '@quadrats/react/carousel';

export function useCarouselTool(controller: ReactCarousel) {
  const editor = useSlateStatic();
  const { setCarouselModalConfig, isModalClosed, setIsModalClosed } = useModal();

  useEffect(() => {
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeCarouselPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, editor, isModalClosed, setIsModalClosed]);

  return {
    onClick: () => {
      controller.insertCarouselPlaceholder(editor);
      setCarouselModalConfig({
        controller,
        onConfirm: (items) => {
          controller.removeCarouselPlaceholder(editor);
          controller.insertCarousel({
            editor,
            items,
          });
        },
      });
    },
  };
}
