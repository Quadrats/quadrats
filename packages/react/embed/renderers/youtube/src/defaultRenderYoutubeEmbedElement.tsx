import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Youtube } from '@quadrats/icons';
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
      {toolbarElement => <VideoIframe {...props} toolbarElement={toolbarElement} />}
    </BaseEmbedElement>
  );
};

export const defaultRenderYoutubeEmbedPlaceholderElement = () => {
  const locale = useLocale();

  return (
    <div className="qdr-embed-youtube__placeholder">
      <Icon className="qdr-embed__placeholder__icon" icon={Youtube} width={48} height={48} />
      <p className="qdr-embed__placeholder__title">{locale.editor.youtube.blockPlaceholder}</p>
    </div>
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