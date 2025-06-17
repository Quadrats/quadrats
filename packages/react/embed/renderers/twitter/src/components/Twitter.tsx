import React, { useRef } from 'react';
import clsx from 'clsx';
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

function Twitter({ attributes, children, data: tweetId, element: { align } }: TwitterProps) {
  const tweetContainerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, tweetContainerRef]);

  useLoadTwitterEmbedApi(tweetId, tweetContainerRef);

  return (
    <div
      {...attributes}
      ref={composedRef}
      className={clsx('qdr-embed-twitter', {
        'qdr-embed-twitter--left': align === 'left' || !align,
        'qdr-embed-twitter--center': align === 'center',
        'qdr-embed-twitter--right': align === 'right',
      })}
      contentEditable={false}
    >
      {attributes ? children : undefined}
    </div>
  );
}

export default Twitter;
