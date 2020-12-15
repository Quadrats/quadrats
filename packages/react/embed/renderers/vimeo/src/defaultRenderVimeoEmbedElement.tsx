import React from 'react';
import { VimeoEmbedElement } from '@quadrats/common/embed/strategies/vimeo';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed/common';

export const defaultRenderVimeoEmbedElement = (props: VideoIframeProps<VimeoEmbedElement>) => (
  <VideoIframe {...props} />
);
