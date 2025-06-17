import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Vimeo } from '@quadrats/icons';
import { VimeoEmbedElement, VimeoEmbedStrategy } from '@quadrats/common/embed/strategies/vimeo';
import { VideoIframe, VideoIframeProps } from '@quadrats/react/embed';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderVimeoEmbedElement = (props: VideoIframeProps<VimeoEmbedElement>) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.vimeo.inputPlaceholder}
      hint={locale.editor.vimeo.hint}
      confirmText={locale.editor.vimeo.confirmText}
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          { ...props.element, videoId: VimeoEmbedStrategy.serialize(value)?.videoId  } as VimeoEmbedElement,
          { at: path },
        );
      }}
    >
      <VideoIframe {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderVimeoEmbedPlaceholderElement = () => {
  const locale = useLocale();

  return (
    <div className="qdr-embed-vimeo__placeholder">
      <Icon className="qdr-embed__placeholder__icon" icon={Vimeo} width={48} height={48} />
      <p className="qdr-embed__placeholder__title">{locale.editor.vimeo.blockPlaceholder}</p>
    </div>
  );
};

export const defaultRenderVimeoEmbedJsxSerializer = (props: VideoIframeProps<VimeoEmbedElement>) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <VideoIframe {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};