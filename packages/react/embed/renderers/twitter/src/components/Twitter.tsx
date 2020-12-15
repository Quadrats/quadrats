import React from 'react';
import { TwitterEmbedElement } from '@quadrats/common/embed/strategies/twitter';
import { RenderElementProps } from '@quadrats/react';
import { useLoadTwitterEmbedApi } from '../hooks/useLoadTwitterEmbedApi';
import { useLoadTwitterEmbedHtml } from '../hooks/useLoadTwitterEmbedHtml';

export interface TwitterProps {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: string;
  element: TwitterEmbedElement;
}

function Twitter({ attributes, children, data: url }: TwitterProps) {
  const html = useLoadTwitterEmbedHtml(url);

  useLoadTwitterEmbedApi(html);

  return (
    <div {...attributes} contentEditable={false}>
      {html && (
        <div
          style={{
            display: 'flex',
            marginTop: -10,
            marginBottom: -10,
          }}
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: html,
          }}
        />
      )}
      {attributes ? children : undefined}
    </div>
  );
}

export default Twitter;
