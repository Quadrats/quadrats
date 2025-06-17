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
  const locale = useLocale();

  return (
    <div className="qdr-embed-podcast-apple__placeholder">
      <Icon className="qdr-embed__placeholder__icon" icon={PodcastAppleIcon} width={24} height={24} />
      <div className="qdr-embed-podcast-apple__placeholder__wrapper">
        <div style={{ width: 120 }} className="qdr-embed__placeholder__body qdr-embed__placeholder__body--square" />
        <div className="qdr-embed-podcast-apple__placeholder__content-wrapper">
          <div className="qdr-embed-podcast-apple__placeholder__title-wrapper">
            <p className="qdr-embed__placeholder__title">{locale.editor.podcastApple.blockPlaceholder}</p>
            <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-18)' }} />
            <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-24)' }} />
          </div>
          <div className="qdr-embed-podcast-apple__placeholder__blocks-wrapper">
            <div className="qdr-embed__placeholder__block" />
            <div className="qdr-embed__placeholder__block" />
          </div>
        </div>
      </div>
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
