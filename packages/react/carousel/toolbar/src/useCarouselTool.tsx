import { useEffect } from 'react';
import { Editor, Element } from '@quadrats/core';
import { CAROUSEL_PLACEHOLDER_TYPE, CarouselPlaceholderElement } from '@quadrats/common/carousel';
import { useSlateStatic } from '@quadrats/react';
import { useModal } from '@quadrats/react/components';
import { ReactCarousel } from '@quadrats/react/carousel';

export function useCarouselTool(controller: ReactCarousel) {
  const editor = useSlateStatic();
  const { setCarouselModalConfig, isModalClosed, setIsModalClosed } = useModal();

  useEffect(() => {
    const [match] = Editor.nodes(editor, {
      at: [],
      match: (node) => {
        const placeholderElement = node as CarouselPlaceholderElement;

        return Element.isElement(placeholderElement) && placeholderElement.type === CAROUSEL_PLACEHOLDER_TYPE;
      },
    });

    if (match) {
      setCarouselModalConfig({
        controller,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [controller, editor]);

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
    },
  };
}
