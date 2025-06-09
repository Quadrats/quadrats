import React from 'react';
import { Transforms } from '@quadrats/core';
import { YoutubeEmbedElement, YoutubeEmbedStrategy } from '@quadrats/common/embed/strategies/youtube';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderYoutubeEmbedElement = (props: VideoIframeProps<YoutubeEmbedElement>) => {
  const { element } = props;

  return (
    <BaseEmbedElement
      element={element}
      placeholder="貼上連結，如 https://youtube.com/..."
      hint="適用於 Youtube 的影片連結"
      confirmText="嵌入影片"
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          { ...props.element, videoId: YoutubeEmbedStrategy.serialize(value)?.videoId  } as YoutubeEmbedElement,
          { at: path },
        );
      }}
    >
      <VideoIframe {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderYoutubeEmbedJsxSerializer = (props: VideoIframeProps<YoutubeEmbedElement>) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <VideoIframe {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};