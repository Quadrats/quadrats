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
  const locale = useLocale();

  return (
    <div className="qdr-embed-twitter__placeholder">
      <div className="qdr-embed-twitter__placeholder__title-wrapper">
        <Icon className="qdr-embed__placeholder__icon" icon={TwitterIcon} width={48} height={48} />
        <p className="qdr-embed__placeholder__title">{locale.editor.twitter.tweet.blockPlaceholder}</p>
      </div>
      <div className="qdr-embed-twitter__placeholder__line-wrapper">
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-28)' }} />
        <div className="qdr-embed__placeholder__line" />
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-21)' }} />
      </div>
      <div className="qdr-embed__placeholder__body" />
      <div className="qdr-embed-twitter__placeholder__set-wrapper">
        <div className="qdr-embed-twitter__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-twitter__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-twitter__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
      </div>
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