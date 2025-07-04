// import React from 'react';
// import { useSlateStatic } from '@quadrats/react';
import { ReactCarousel, useCarouselModal } from '@quadrats/react/carousel';
import { useModal } from '@quadrats/react/components';

export function useCarouselTool(controller: ReactCarousel) {
  // const editor = useSlateStatic();
  const { openModal } = useModal();
  const { sideChildren, children, customizedFooterElement } = useCarouselModal(controller);

  return {
    onClick: () => {
      openModal({
        title: '建立輪播',
        size: 'extraLarge',
        closable: true,
        haveCloseButton: false,
        confirmText: '建立輪播',
        sideChildren,
        children,
        customizedFooterElement,
      });

      // controller.insertCarouselPlaceholder(editor);
    },
  };
}
