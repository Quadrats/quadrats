import React, { useState, useRef, useEffect } from 'react';
import { Textarea, Input, Modal } from '@quadrats/react/components';
import { useLocale } from '@quadrats/react/configs';

export interface EmbedModalProps {
  isOpen: boolean;
  close: VoidFunction;
  placeholder: string;
  confirmText: string;
  hint: string;
  type: 'input' | 'textarea';
  onConfirm: (value: string) => void;
}

export const EmbedModal = ({ isOpen, close, placeholder, confirmText, hint, type, onConfirm }: EmbedModalProps) => {
  const [value, setValue] = useState('');
  const locale = useLocale();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      textareaRef.current?.focus();
      inputRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      title={locale.editor.embedTitle}
      confirmText={confirmText}
      onClose={() => {
        close();
        setValue('');
      }}
      onConfirm={() => {
        close();
        onConfirm(value);
      }}
    >
      {type === 'textarea' ? (
        <Textarea
          textareaRef={textareaRef}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          hint={hint}
          height={86}
        />
      ) : (
        <Input inputRef={inputRef} value={value} onChange={setValue} placeholder={placeholder} hint={hint} />
      )}
    </Modal>
  );
};
