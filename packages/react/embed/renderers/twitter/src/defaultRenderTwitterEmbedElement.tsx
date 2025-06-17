import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Twitter as TwitterIcon } from '@quadrats/icons';
import { TwitterEmbedElement, TwitterEmbedStrategy } from '@quadrats/common/embed/strategies/twitter';
import Twitter, { TwitterProps } from './components/Twitter';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderTwitterEmbedElement = (props: TwitterProps) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.twitter.tweet.inputPlaceholder}
      hint={locale.editor.twitter.tweet.hint}
      confirmText={locale.editor.twitter.tweet.confirmText}
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          {
            ...props.element,
            embedType: TwitterEmbedStrategy.serialize(value)?.embedType,
            tweetId: TwitterEmbedStrategy.serialize(value)?.tweetId,
          } as TwitterEmbedElement,
          { at: path },
        );
      }}
    >
      <Twitter {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderTwitterEmbedPlaceholderElement = () => {
  return (
    <div className="qdr-embed-twitter__placeholder">
      <Icon className="qdr-embed-twitter__placeholder__icon" icon={TwitterIcon} width={48} height={48} />
    </div>
  );
};

export const defaultRenderTwitterEmbedJsxSerializer = (props: TwitterProps) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <Twitter {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};