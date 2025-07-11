import React, { useMemo } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { useCarousel } from '../hooks/useCarousel';
import { RenderCarouselCaptionElementProps } from '../typings';

export function CarouselCaption({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselCaptionElementProps['element'];
}) {
  const { activeIndex } = useCarousel();

  const currentCaption = useMemo(() => element.captions[activeIndex], [activeIndex, element.captions]);

  if (!currentCaption) return null;

  return (
    <div {...attributes} contentEditable={false} className="qdr-carousel__caption">
      {currentCaption}
    </div>
  );
}

export default CarouselCaption;
