import React from 'react';
import { Icon } from '@quadrats/react/components';
import { Card } from '@quadrats/icons';
import { RenderCardPlaceholderElementProps } from '../typings';

export function CardPlaceholder({ attributes, element }: RenderCardPlaceholderElementProps) {
  return (
    <div {...attributes} className="qdr-card__placeholder" contentEditable={false}>
      <div
        contentEditable={false}
        className="qdr-card__placeholder-image-wrapper"
        style={{ aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '1 / 1' }}
      >
        <Icon icon={Card} width={48} height={48} />
      </div>
      <div contentEditable={false} className="qdr-card__placeholder-contents">
        <div className="qdr-card__content-wrapper">
          <div className="qdr-card__title">
            <div className="qdr-card__placeholder__line" />
            <div className="qdr-card__placeholder__line" />
          </div>
          <div className="qdr-card__description">
            <div className="qdr-card__placeholder__line" />
            <div className="qdr-card__placeholder__line" />
          </div>
          <div className="qdr-card__remark">
            <div className="qdr-card__placeholder__line" />
            <div className="qdr-card__placeholder__line" />
          </div>
        </div>
        <div className="qdr-card__link-wrapper">
          <div className="qdr-card__placeholder__line" style={{ width: 100 }} />
        </div>
      </div>
    </div>
  );
}

export default CardPlaceholder;
