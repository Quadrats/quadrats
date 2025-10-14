import React, { ReactNode } from 'react';
import { EmbedElement } from '@quadrats/common/embed';
import { RenderElementProps } from '@quadrats/react';
import { composeRefs } from '@quadrats/react/utils';
import { useVideoIframeSize } from '../hooks/useVideoIframeSize';

export interface VideoIframeProps<E extends EmbedElement> {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: string;
  element: E;
  toolbarElement: ReactNode;
}

function VideoIframe<E extends EmbedElement>({
  attributes,
  children,
  data: src,
  toolbarElement,
}: VideoIframeProps<E>) {
  const { ref } = attributes || {};
  const { ref: containerRef, size } = useVideoIframeSize<HTMLDivElement>();
  const composedRef = ref ? composeRefs([ref, containerRef]) : containerRef;

  return (
    <div
      {...attributes}
      ref={composedRef}
      className="qdr-embed-video"
      contentEditable={false}
    >
      {toolbarElement}
      <div style={size}>
        <iframe title={src} src={src} frameBorder="0" width="100%" height="100%" />
      </div>
      {attributes ? children : undefined}
    </div>
  );
}

export default VideoIframe;
