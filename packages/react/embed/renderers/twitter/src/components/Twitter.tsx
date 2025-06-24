import React, { useRef, ReactNode } from 'react';
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
  toolbarElement: ReactNode;
}

function Twitter({ attributes, children, data: tweetId, element: { align }, toolbarElement }: TwitterProps) {
  const tweetContainerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, tweetContainerRef]);

  useLoadTwitterEmbedApi(tweetId, tweetContainerRef);

  return (
    <div
      {...attributes}
      className={clsx('qdr-embed-twitter', {
        'qdr-embed-twitter--left': align === 'left' || !align,
        'qdr-embed-twitter--center': align === 'center',
        'qdr-embed-twitter--right': align === 'right',
      })}
      contentEditable={false}
    >
      <div
        className="qdr-embed__inline-toolbar-wrapper"
        style={{
          width: '100%',
          maxWidth: 550,
        }}
      >
        {toolbarElement}
        <div ref={composedRef} className="qdr-embed-twitter__container" />
        {attributes ? children : undefined}
      </div>
    </div>
  );
}

export default Twitter;
