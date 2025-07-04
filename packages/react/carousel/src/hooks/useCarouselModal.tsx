import React from 'react';
import { ReactCarousel } from '../typings';

export function useCarouselModal(controller: ReactCarousel) {
  console.log('controller', controller);

  return {
    sideChildren: <div>sideChildren</div>,
    children: <div>建立輪播</div>,
  };
}
