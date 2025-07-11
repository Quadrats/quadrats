import React, { useState } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { CarouselContext } from '../contexts/CarouselContext';
import { RenderCarouselElementProps } from '../typings';

export function Carousel({
  attributes,
  children,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselElementProps['element'];
}) {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  return (
    <CarouselContext.Provider
      value={{
        activeIndex,
        setActiveIndex,
      }}
    >
      <div {...attributes} contentEditable={false}>
        {children}
      </div>
    </CarouselContext.Provider>
  );
}

export default Carousel;
