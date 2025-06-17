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
  return (
    <div className="qdr-embed-facebook__placeholder">
      <Icon className="qdr-embed-facebook__placeholder__icon" icon={FacebookIcon} width={48} height={48} />
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