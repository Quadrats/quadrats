import React from 'react';
import { RenderElementProps, useLocale } from '@quadrats/react';
import './read-more.styles';

export interface ReadMoreProps {
  attributes?: RenderElementProps['attributes'];
  children: any;
}

function ReadMore(props: ReadMoreProps) {
  const { attributes, children } = props;
  const { readMore } = useLocale().editor;

  return (
    <div {...attributes} className="qdr-read-more" contentEditable={false}>
      <span className="qdr-read-more__description">{readMore}</span>
      {attributes ? children : undefined}
    </div>
  );
}

export default ReadMore;
