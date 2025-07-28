import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { ArrowDown } from '@quadrats/icons';
import { RenderCardContentsElementProps } from '../typings';

export function CardContents({
  attributes,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderCardContentsElementProps['element'];
}) {
  return (
    <div {...attributes} contentEditable={false} className="qdr-card__contents">
      <div className="qdr-card__content-wrapper">
        <p className="qdr-card__title">{element.title}</p>
        <p className="qdr-card__description">{element.description}</p>
        <p className="qdr-card__remark">{element.remark}</p>
      </div>
      {element.haveLink && (
        <div className="qdr-card__link-wrapper">
          <a href={element.linkUrl} className="qdr-card__link">
            {element.linkText}
            <Icon icon={ArrowDown} width={20} height={20} className="qdr-card__link-icon" />
          </a>
        </div>
      )}
    </div>
  );
}

export default CardContents;
