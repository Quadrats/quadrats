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
  return (
    <div className="qdr-embed-instagram__placeholder">
      <Icon className="qdr-embed-instagram__placeholder__icon" icon={InstagramIcon} width={48} height={48} />
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