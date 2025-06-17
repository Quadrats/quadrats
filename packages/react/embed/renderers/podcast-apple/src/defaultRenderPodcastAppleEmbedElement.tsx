import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { PodcastApple as PodcastAppleIcon } from '@quadrats/icons';
import { PodcastAppleEmbedElement, PodcastAppleEmbedStrategy } from '@quadrats/common/embed/strategies/podcast-apple';
import PodcastApple, { PodcastAppleProps } from './components/PodcastApple';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderPodcastAppleEmbedElement = (props: PodcastAppleProps) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.podcastApple.inputPlaceholder}
      hint={locale.editor.podcastApple.hint}
      confirmText={locale.editor.podcastApple.confirmText}
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          { ...props.element,
            embedType: PodcastAppleEmbedStrategy.serialize(value)?.embedType,
            language: PodcastAppleEmbedStrategy.serialize(value)?.language,
            contextId: PodcastAppleEmbedStrategy.serialize(value)?.contextId,
          } as PodcastAppleEmbedElement,
          { at: path },
        );
      }}
    >
      <PodcastApple {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderPodcastAppleEmbedPlaceholderElement = () => {
  return (
    <div className="qdr-embed-podcast-apple__placeholder">
      <Icon className="qdr-embed-podcast-apple__placeholder__icon" icon={PodcastAppleIcon} width={48} height={48} />
    </div>
  );
};

export const defaultRenderPodcastAppleEmbedJsxSerializer = (props: PodcastAppleProps) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <PodcastApple {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};
