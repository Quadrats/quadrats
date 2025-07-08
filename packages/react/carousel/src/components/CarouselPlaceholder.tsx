import React from 'react';
import { Icon } from '@quadrats/react/components';
import { Image } from '@quadrats/icons';
import { RenderCarouselPlaceholderElementProps } from '../typings';

export function CarouselPlaceholder({ attributes, element }: RenderCarouselPlaceholderElementProps) {
  return (
    <div {...attributes} className="qdr-carousel__placeholder" contentEditable={false}>
      <div
        className="qdr-carousel__placeholder__icon-wrapper"
        style={{ aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '3 / 2' }}
      >
        <Icon className="qdr-carousel__placeholder__icon" icon={Image} width={48} height={48} />
      </div>
      <div className="qdr-carousel__dots">
        <div className="qdr-carousel__dot qdr-carousel__dot--active" />
        <div className="qdr-carousel__dot" />
        <div className="qdr-carousel__dot" />
        <div className="qdr-carousel__dot" />
        <div className="qdr-carousel__dot" />
      </div>
    </div>
  );
}

export default CarouselPlaceholder;
