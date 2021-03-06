import React from 'react';
import { YoutubeEmbedElement } from '@quadrats/common/embed/strategies/youtube';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed';

export const defaultRenderYoutubeEmbedElement = (props: VideoIframeProps<YoutubeEmbedElement>) => (
  <VideoIframe {...props} />
);
