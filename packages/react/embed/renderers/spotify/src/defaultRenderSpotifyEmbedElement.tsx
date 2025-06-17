import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Spotify as SpotifyIcon } from '@quadrats/icons';
import { SpotifyEmbedElement, SpotifyEmbedStrategy } from '@quadrats/common/embed/strategies/spotify';
import PodcastSpotify, { SpotifyProps } from './components/Spotify';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderSpotifyEmbedElement = (props: SpotifyProps) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.spotify.inputPlaceholder}
      hint={locale.editor.spotify.hint}
      confirmText={locale.editor.spotify.confirmText}
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          { ...props.element,
            embedType: SpotifyEmbedStrategy.serialize(value)?.embedType,
            contextId: SpotifyEmbedStrategy.serialize(value)?.contextId,
          } as SpotifyEmbedElement,
          { at: path },
        );
      }}
    >
      <PodcastSpotify {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderSpotifyEmbedPlaceholderElement = () => {
  return (
    <div className="qdr-embed-spotify__placeholder">
      <Icon className="qdr-embed-spotify__placeholder__icon" icon={SpotifyIcon} width={48} height={48} />
    </div>
  );
};

export const defaultRenderSpotifyEmbedJsxSerializer = (props: SpotifyProps) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <PodcastSpotify {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};
