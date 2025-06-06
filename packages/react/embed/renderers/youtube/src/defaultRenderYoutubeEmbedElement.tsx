import React from 'react';
import { YoutubeEmbedElement } from '@quadrats/common/embed/strategies/youtube';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderYoutubeEmbedElement = (props: VideoIframeProps<YoutubeEmbedElement>) => (
  <BaseEmbedElement element={props.element}>
    <VideoIframe {...props} />
  </BaseEmbedElement>
);

export const defaultRenderYoutubeEmbedJsxSerializer = (props: VideoIframeProps<YoutubeEmbedElement>) => (
  <BaseEmbedElementWithoutToolbar element={props.element}>
    <VideoIframe {...props} />
  </BaseEmbedElementWithoutToolbar>
);