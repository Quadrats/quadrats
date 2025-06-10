import React, { useRef, useMemo, useState, useEffect } from 'react';
import { useSlateStatic, useLocale } from '@quadrats/react';
import { ReactEmbed } from '@quadrats/react/embed';
import { useModal, Textarea, Input } from '@quadrats/react/components';

export function useEmbedTool<P extends string>(
  controller: ReactEmbed<P>,
  provider: P,
) {
  const locale = useLocale();
  const modalConfigRef = useRef('');
  const editor = useSlateStatic();
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

  return {
    onClick: () => {
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
        onConfirm: () => {
          controller.insertEmbed(editor, provider, modalConfigRef.current);
        },
      });
    },
  };
}
