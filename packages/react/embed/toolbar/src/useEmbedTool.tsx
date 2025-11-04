import { useMemo, useEffect } from 'react';
import { useSlateStatic, useLocale, useModal } from '@quadrats/react';
import { ReactEmbed } from '@quadrats/react/embed';

type ConfigType = {
  type: 'input' | 'textarea';
  placeholder: string;
  confirmText: string;
  hint: string;
};

export function useEmbedTool<P extends string>(controller: ReactEmbed<P>, provider: P) {
  const locale = useLocale();
  const editor = useSlateStatic();
  const { setEmbedModalConfig, isModalClosed, setIsModalClosed } = useModal();

  const config = useMemo((): ConfigType => {
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
    if (isModalClosed) {
      setTimeout(() => {
        controller.removeEmbedPlaceholder(editor);
        setIsModalClosed(false);
      }, 250);
    }
  }, [controller, editor, isModalClosed, setIsModalClosed]);

  return {
    onClick: () => {
      controller.insertEmbedPlaceholder(editor, provider);
      setEmbedModalConfig({
        onConfirm: (value) => {
          controller.insertEmbed(editor, provider, value);
          controller.removeEmbedPlaceholder(editor);
        },
        ...config,
      });
    },
  };
}
