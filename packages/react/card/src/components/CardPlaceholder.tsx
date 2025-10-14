import React from 'react';
import { Icon } from '@quadrats/react/components';
import { Image } from '@quadrats/icons';
import { RenderCardPlaceholderElementProps } from '../typings';

export function CardPlaceholder({ attributes, element }: RenderCardPlaceholderElementProps) {
  return (
    <div {...attributes} className="qdr-card__placeholder" contentEditable={false}>
      <div
        contentEditable={false}
        className="qdr-card__placeholder-image-wrapper"
        style={{ aspectRatio: element.ratio ? `${element.ratio[0]} / ${element.ratio[1]}` : '1 / 1' }}
      >
        <Icon icon={Image} width={48} height={48} />
        <div className="qdr-card__placeholder-bg" />
      </div>
      <div contentEditable={false} className="qdr-card__placeholder-contents">
        <div className="qdr-card__placeholder-content-wrapper">
          <div
            className="qdr-card__placeholder__line qdr-card__placeholder__line--small-radius"
            style={{ height: 24 }}
          />
          <div className="qdr-card__placeholder-description-wrapper">
            <div className="qdr-card__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-12)' }} />
            <div className="qdr-card__placeholder__line" />
            <div className="qdr-card__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-19)' }} />
          </div>
        </div>
        <div className="qdr-card__placeholder-link-wrapper">
          <div
            className="qdr-card__placeholder__line qdr-card__placeholder__line--small-radius"
            style={{ width: 120, height: 32 }}
          />
        </div>
      </div>
    </div>
  );
}

export default CardPlaceholder;
