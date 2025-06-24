import React, { PropsWithChildren, useRef, ReactNode } from 'react';
import { PodcastAppleEmbedElement } from '@quadrats/common/embed/strategies/podcast-apple';
import { RenderElementProps } from '@quadrats/react';
import { composeRefs } from '@quadrats/react/utils';

export interface PodcastAppleProps {
  attributes?: RenderElementProps['attributes'];
  data: string;
  element: PodcastAppleEmbedElement;
  toolbarElement: ReactNode;
}

function PodcastApple({ attributes, children, data: src, toolbarElement }: PropsWithChildren<PodcastAppleProps>) {
  const containerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, containerRef]);

  return (
    <div
      {...attributes}
      className="qdr-embed-podcast-apple"
      ref={composedRef}
      contentEditable={false}
    >
      {toolbarElement}
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
