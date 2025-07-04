import { useSlateStatic } from '@quadrats/react';
import { ReactCarousel } from '@quadrats/react/carousel';

export function useCarouselTool(controller: ReactCarousel) {
  const editor = useSlateStatic();

  return {
    onClick: () => {
      controller.insertCarouselPlaceholder(editor);
    },
  };
}
