import React, { PropsWithChildren, useRef } from 'react';
import { PodcastAppleEmbedElement } from '@quadrats/common/embed/strategies/podcast-apple';
import { RenderElementProps } from '@quadrats/react';
import { composeRefs } from '@quadrats/react/utils';

export interface PodcastAppleProps {
  attributes?: RenderElementProps['attributes'];
  data: string;
  element: PodcastAppleEmbedElement;
}

function PodcastApple({ attributes, children, data: src }: PropsWithChildren<PodcastAppleProps>) {
  const containerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, containerRef]);

  return (
    <div
      {...attributes}
      className="qdr-embed-podcast-apple"
      ref={composedRef}
      contentEditable={false}
    >
      <iframe
        title={src}
        src={src}
        frameBorder="0"
        width="100%"
        height="450px"
      />
      {attributes ? children : undefined}
    </div>
  );
}

export default PodcastApple;
