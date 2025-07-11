import React, { useCallback, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { useCarousel } from '../hooks/useCarousel';
import { RenderCarouselImagesElementProps } from '../typings';

const deltaLimit = 100;

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
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [startX, setStartX] = useState<number>(0);
  const [delta, setDelta] = useState(0);

  const images = useMemo(() => element.images, [element.images]);

  const onMouseUp = useCallback(() => {
    setIsDragging(false);

    if (delta < -deltaLimit && activeIndex < images.length - 1) {
      setActiveIndex((prev) => prev + 1);
    } else if (delta > deltaLimit && activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }

    setDelta(0);
  }, [activeIndex, delta, images.length, setActiveIndex]);

  return (
    <div {...attributes} contentEditable={false} className="qdr-carousel__images-wrapper">
      <div
        className={clsx('qdr-carousel__slider-wrapper', {
          'qdr-carousel__slider-wrapper--isDragging': isDragging,
        })}
        onMouseDown={(e) => {
          setIsDragging(true);
          setStartX(e.clientX);
        }}
        onMouseMove={(e) => {
          if (isDragging) {
            const delta = e.clientX - startX;

            setDelta(delta);
          }
        }}
        onMouseUp={onMouseUp}
      >
        <div
          className={clsx('qdr-carousel__slider', {
            'qdr-carousel__slider--isDragging': isDragging,
          })}
          style={{
            transform: `translateX(${delta - activeIndex * (imageRef.current?.clientWidth ?? 0)}px)`,
          }}
        >
          {images.map((image) => (
            <img
              ref={imageRef}
              draggable={false}
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
