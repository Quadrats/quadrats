import React from 'react';
import { Transforms } from '@quadrats/core';
import { useLocale } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Facebook as FacebookIcon } from '@quadrats/icons';
import Facebook, { FacebookProps } from './components/Facebook';
import { FacebookEmbedElement, FacebookEmbedStrategy } from '@quadrats/common/embed/strategies/facebook';
import { BaseEmbedElement, BaseEmbedElementWithoutToolbar } from '@quadrats/react/embed/renderers/base';

export const defaultRenderFacebookEmbedElement = (props: FacebookProps) => {
  const { element } = props;
  const locale = useLocale();

  return (
    <BaseEmbedElement
      element={element}
      placeholder={locale.editor.facebook.inputPlaceholder}
      hint={locale.editor.facebook.hint}
      confirmText={locale.editor.facebook.confirmText}
      type="textarea"
      onConfirm={(editor, path, value) => {
        Transforms.setNodes(
          editor,
          {
            ...props.element,
            url: FacebookEmbedStrategy.serialize(value)?.url,
            width: FacebookEmbedStrategy.serialize(value)?.width,
            height: FacebookEmbedStrategy.serialize(value)?.height,
            embedType: FacebookEmbedStrategy.serialize(value)?.embedType,
          } as FacebookEmbedElement,
          { at: path },
        );
      }}
    >
      <Facebook {...props} />
    </BaseEmbedElement>
  );
};

export const defaultRenderFacebookEmbedPlaceholderElement = () => {
  const locale = useLocale();

  return (
    <div className="qdr-embed-facebook__placeholder">
      <div className="qdr-embed-facebook__placeholder__title-wrapper">
        <Icon className="qdr-embed__placeholder__icon" icon={FacebookIcon} width={48} height={48} />
        <p className="qdr-embed__placeholder__title">{locale.editor.facebook.blockPlaceholder}</p>
      </div>
      <div className="qdr-embed-facebook__placeholder__line-wrapper">
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-28)' }} />
        <div className="qdr-embed__placeholder__line" />
        <div className="qdr-embed__placeholder__line" style={{ marginRight: 'var(--qdr-spacing-21)' }} />
      </div>
      <div className="qdr-embed__placeholder__body" />
      <div className="qdr-embed-facebook__placeholder__set-wrapper">
        <div className="qdr-embed-facebook__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-facebook__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
        <div className="qdr-embed-facebook__placeholder__tools-set">
          <div className="qdr-embed__placeholder__dot" />
          <div className="qdr-embed__placeholder__line qdr-embed__placeholder__line--shortest" />
        </div>
      </div>
    </div>
  );
};

export const defaultRenderFacebookEmbedJsxSerializer = (props: FacebookProps) => {
  const { element } = props;

  return (
    <BaseEmbedElementWithoutToolbar element={element}>
      <Facebook {...props} />
    </BaseEmbedElementWithoutToolbar>
  );
};