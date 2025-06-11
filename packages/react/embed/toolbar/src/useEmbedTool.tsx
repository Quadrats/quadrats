import React, { useRef, useMemo, useState, useEffect } from 'react';
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

      default:
        return {
          type: 'input',
          placeholder: '',
          confirmText: '',
          hint: '',
        };
    }
  }, [provider]);

  useEffect(() => {
    if (editor.children.find(
      (c) => {
        const placeholderElement = c as EmbedPlaceholderElement;

        return placeholderElement?.type === EMBED_PLACEHOLDER_TYPE && placeholderElement?.provider === provider;
      },
    )) {
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
  }, [editor, provider, controller, config, modalConfigRef]);

  useEffect(() => {
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeEmbedPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, isModalClosed]);

  return {
    onClick: () => {
      controller.insertEmbedPlaceholder(editor, provider);
    },
  };
}
