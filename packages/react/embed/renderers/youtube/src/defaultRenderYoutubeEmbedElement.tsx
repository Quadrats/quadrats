import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { YoutubeEmbedElement, YoutubeEmbedStrategy } from '@quadrats/common/embed/strategies/youtube';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderYoutubeEmbedElement = (props: VideoIframeProps<YoutubeEmbedElement>) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.youtube.inputPlaceholder}
      hint={locale.editor.youtube.hint}
      confirmText={locale.editor.youtube.confirmText}
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