import React from 'react';
import { Icon } from '@quadrats/react/components';
import { RenderElementProps } from '@quadrats/react';
import { Image } from '@quadrats/icons';

export function CarouselPlaceholder({
  attributes,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  return (
    <div {...attributes} className="qdr-carousel__placeholder" contentEditable={false}>
      <div className="qdr-carousel__placeholder__icon-wrapper">
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
