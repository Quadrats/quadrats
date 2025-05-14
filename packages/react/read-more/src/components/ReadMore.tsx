import React from 'react';
import { RenderElementProps, useLocale } from '@quadrats/react';

export interface ReadMoreProps {
  attributes?: RenderElementProps['attributes'];
  children: any;
}

function ReadMore(props: ReadMoreProps) {
  const { attributes } = props;
  const { readMore } = useLocale().editor;

  return (
    <div {...attributes} className="qdr-read-more" contentEditable={false}>
      <div className="qdr-read-more__container">
        <div className="qdr-read-more__container__line" />
        <span className="qdr-read-more__container__description">{readMore}</span>
        <div className="qdr-read-more__container__line" />
      </div>
    </div>
  );
}

export default ReadMore;
