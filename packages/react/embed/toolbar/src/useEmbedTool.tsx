import React, { useRef, useMemo, useState, useEffect } from 'react';
import {
  Editor,
  Element,
} from '@quadrats/core';
import { useSlateStatic, useLocale } from '@quadrats/react';
import { EMBED_PLACEHOLDER_TYPE, EmbedPlaceholderElement } from '@quadrats/common/embed';
import { ReactEmbed } from '@quadrats/react/embed';
import { useModal, Textarea, Input } from '@quadrats/react/components';

export function useEmbedTool<P extends string>(
  controller: ReactEmbed<P>,
  provider: P,
) {
  const locale = useLocale();
  const modalConfigRef = useRef('');
  const editor = useSlateStatic();
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const { openModal } = useModal();

  const config = useMemo((): {
    type: 'input' | 'textarea',
    placeholder: string;
    confirmText: string;
    hint: string;
  } => {
    switch (provider) {
      case 'youtube':
        return {
          type: 'input',
          placeholder: locale.editor.youtube.inputPlaceholder,
          confirmText: locale.editor.youtube.confirmText,
          hint: locale.editor.youtube.hint,
        };

      case 'vimeo':
        return {
          type: 'input',
          placeholder: locale.editor.vimeo.inputPlaceholder,
          confirmText: locale.editor.vimeo.confirmText,
          hint: locale.editor.vimeo.hint,
        };

      case 'instagram':
        return {
          type: 'input',
          placeholder: locale.editor.instagram.inputPlaceholder,
          confirmText: locale.editor.instagram.confirmText,
          hint: locale.editor.instagram.hint,
        };

      case 'facebook':
        return {
          type: 'textarea',
          placeholder: locale.editor.facebook.inputPlaceholder,
          confirmText: locale.editor.facebook.confirmText,
          hint: locale.editor.facebook.hint,
        };

      case 'twitter':
        return {
          type: 'input',
          placeholder: locale.editor.twitter.tweet.inputPlaceholder,
          confirmText: locale.editor.twitter.tweet.confirmText,
          hint: locale.editor.twitter.tweet.hint,
        };

      case 'podcastApple':
        return {
          type: 'input',
          placeholder: locale.editor.podcastApple.inputPlaceholder,
          confirmText: locale.editor.podcastApple.confirmText,
          hint: locale.editor.podcastApple.hint,
        };

      case 'spotify':
        return {
          type: 'input',
          placeholder: locale.editor.spotify.inputPlaceholder,
          confirmText: locale.editor.spotify.confirmText,
          hint: locale.editor.spotify.hint,
        };

      default:
        return {
          type: 'input',
          placeholder: '',
          confirmText: '',
          hint: '',
        };
    }
  }, [locale, provider]);

  useEffect(() => {
    const [match] = Editor.nodes(editor, {
      at: [],
      match: (node) => {
        const placeholderElement = node as EmbedPlaceholderElement;

        return (
          Element.isElement(placeholderElement) &&
          placeholderElement.type === EMBED_PLACEHOLDER_TYPE &&
          placeholderElement.provider === provider
        );
      },
    });

    if (match) {
      openModal({
        title: locale.editor.embedTitle,
        children: (() => {
          const EmbedComponent = () => {
            const [value, setValue] = useState('');

            useEffect(() => {
              modalConfigRef.current = value;
            }, [value]);

            if (config.type === 'textarea') {
              return (
                <Textarea
                  value={value}
                  onChange={setValue}
                  placeholder={config.placeholder}
                  hint={config.hint}
                  height={86}
                />
              );
            }

            return (
              <Input
                value={value}
                onChange={setValue}
                placeholder={config.placeholder}
                hint={config.hint}
              />
            );
          };

          return <EmbedComponent />;
        })(),
        confirmText: config.confirmText,
        onClose: () => {
          setIsModalClosed(true);
        },
        onConfirm: () => {
          controller.removeEmbedPlaceholder(editor);
          controller.insertEmbed(editor, provider, modalConfigRef.current);
        },
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, provider, controller, config, modalConfigRef, locale]);

  useEffect(() => {
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeEmbedPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, isModalClosed, editor]);

  return {
    onClick: () => {
      controller.insertEmbedPlaceholder(editor, provider);
    },
  };
}
