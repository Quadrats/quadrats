import React, { useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { useCarousel } from '../hooks/useCarousel';
import { RenderCarouselImagesElementProps } from '../typings';

export function CarouselImages({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCarouselImagesElementProps['element'];
}) {
  const { activeIndex } = useCarousel();

  const currentImage = useMemo(() => element.images[activeIndex], [activeIndex, element.images]);

  return (
    <div {...attributes} contentEditable={false} className="qdr-carousel__images-wrapper">
      <img
        className="qdr-carousel__image"
        src={currentImage}
        style={{
          objectFit: element.ratio ? 'cover' : 'contain',
          aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '3 / 2',
        }}
      />
      <div className="qdr-carousel__dots">
        {element.images.map((_, index) => (
          <div
            key={index}
            className={clsx('qdr-carousel__dot', {
              'qdr-carousel__dot--active': index === activeIndex,
            })}
          />
        ))}
      </div>
    </div>
  );
}

export default CarouselImages;
