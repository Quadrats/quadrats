import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Instagram as InstagramIcon } from '@quadrats/icons';
import { InstagramEmbedElement, InstagramEmbedStrategy } from '@quadrats/common/embed/strategies/instagram';
import Instagram, { InstagramProps } from './components/Instagram';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderInstagramEmbedElement = (props: InstagramProps) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.instagram.inputPlaceholder}
      hint={locale.editor.instagram.hint}
      confirmText={locale.editor.instagram.confirmText}
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          { ...props.element, url: InstagramEmbedStrategy.serialize(value)?.url  } as InstagramEmbedElement,
          { at: path },
        );
      }}
    >
      <Instagram {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderInstagramEmbedPlaceholderElement = () => {
  const locale = useLocale();

  return (
    <div className="qdr-embed-instagram__placeholder">
      <div className="qdr-embed-instagram__placeholder__title-wrapper">
        <Icon className="qdr-embed__placeholder__icon" icon={InstagramIcon} width={48} height={48} />
        <p className="qdr-embed__placeholder__title">{locale.editor.instagram.blockPlaceholder}</p>
      </div>
      <div className="qdr-embed__placeholder__body qdr-embed__placeholder__body--square" />
      <div className="qdr-embed-instagram__placeholder__set-wrapper">
        <div className="qdr-embed-instagram__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-instagram__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-instagram__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
      </div>
      <div className="qdr-embed-instagram__placeholder__line-wrapper">
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-28)' }} />
        <div className="qdr-embed__placeholder__line" />
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-21)' }} />
      </div>
    </div>
  );
};

export const defaultRenderInstagramEmbedJsxSerializer = (props: InstagramProps) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <Instagram {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};