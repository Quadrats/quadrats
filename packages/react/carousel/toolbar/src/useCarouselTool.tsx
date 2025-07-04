import { useEffect } from 'react';
import { Editor, Element } from '@quadrats/core';
import { CAROUSEL_PLACEHOLDER_TYPE, CarouselPlaceholderElement } from '@quadrats/common/carousel';
import { useSlateStatic } from '@quadrats/react';
import { ReactCarousel, useCarouselModal } from '@quadrats/react/carousel';

export function useCarouselTool(controller: ReactCarousel) {
  const editor = useSlateStatic();
  const { setIsOpen } = useCarouselModal(controller);

  useEffect(() => {
    const [match] = Editor.nodes(editor, {
      at: [],
      match: (node) => {
        const placeholderElement = node as CarouselPlaceholderElement;

        return Element.isElement(placeholderElement) && placeholderElement.type === CAROUSEL_PLACEHOLDER_TYPE;
      },
    });

    if (match) {
      setIsOpen(true);
    }
  }, [editor, setIsOpen]);

  return {
    onClick: () => {
      controller.insertCarouselPlaceholder(editor);
    },
  };
}
