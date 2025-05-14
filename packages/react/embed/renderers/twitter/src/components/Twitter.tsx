import React, { useRef } from 'react';
import { TwitterEmbedElement } from '@quadrats/common/embed/strategies/twitter';
import { RenderElementProps } from '@quadrats/react';
import { composeRefs } from '@quadrats/react/utils';
import { useLoadTwitterEmbedApi } from '../hooks/useLoadTwitterEmbedApi';

export interface TwitterProps {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: string;
  element: TwitterEmbedElement;
}

function Twitter({ attributes, children, data: tweetId }: TwitterProps) {
  const tweetContainerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, tweetContainerRef]);

  useLoadTwitterEmbedApi(tweetId, tweetContainerRef);

  return (
    <div
      {...attributes}
      ref={composedRef}
      className="qdr-embed-twitter qdr-embed-x"
      contentEditable={false}
    >
      {attributes ? children : undefined}
    </div>
  );
}

export default Twitter;
