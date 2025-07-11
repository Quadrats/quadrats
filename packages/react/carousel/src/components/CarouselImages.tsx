import React, { useMemo, useRef } from 'react';
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
  const imageRef = useRef<HTMLImageElement | null>(null);
  const { activeIndex, setActiveIndex } = useCarousel();

  const images = useMemo(() => element.images, [element.images]);

  // const currentImage = useMemo(() => images[activeIndex], [activeIndex, images]);

  return (
    <div {...attributes} contentEditable={false} className="qdr-carousel__images-wrapper">
      <div className="qdr-carousel__slider-wrapper">
        <div
          className="qdr-carousel__slider"
          style={{
            transform: `translateX(${0 - activeIndex * (imageRef.current?.clientWidth ?? 0)}px)`,
          }}
        >
          {images.map((image) => (
            <img
              ref={imageRef}
              key={image}
              className="qdr-carousel__image"
              src={image}
              style={{
                objectFit: element.ratio ? 'cover' : 'contain',
                aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '3 / 2',
              }}
            />
          ))}
        </div>
      </div>
      <div className="qdr-carousel__dots">
        {images.map((_, index) => (
          <div
            key={index}
            onClick={() => {
              setActiveIndex(index);
            }}
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
