import React, { useRef, useMemo } from 'react';
import { SpotifyEmbedElement } from '@quadrats/common/embed/strategies/spotify';
import { RenderElementProps } from '@quadrats/react';
import { composeRefs } from '@quadrats/react/utils';

export interface SpotifyProps {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: string;
  element: SpotifyEmbedElement;
}

function Spotify({ attributes, children, data: src }: SpotifyProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const composedRef = composeRefs([attributes?.ref, containerRef]);

  const higher = useMemo(() => (
    !!src.match(/\/playlist/)
  ), [src]);

  return (
    <div
      {...attributes}
      ref={composedRef}
      className="qdr-embed-spotify"
      contentEditable={false}
    >
      <iframe
        title={src}
        src={src}
        frameBorder="0"
        width="100%"
        allow="autoplay"
        clipboard-write="true"
        encrypted-media="true"
        picture-in-picture="true"
        height={higher ? '400px' : '152px'}
        style={{
          maxHeight: '100%',
          height: higher ? '400px' : '152px',
        }}
      />
      {attributes ? children : undefined}
    </div>
  );
}

export default Spotify;
