import React, { useState } from 'react';
import { useLocale } from '@quadrats/react';
import { Textarea, Input, Modal } from '@quadrats/react/components';

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
        onConfirm(value);
      }}
    >
      {type === 'textarea' ? (
        <Textarea value={value} onChange={setValue} placeholder={placeholder} hint={hint} height={86} />
      ) : (
        <Input value={value} onChange={setValue} placeholder={placeholder} hint={hint} />
      )}
    </Modal>
  );
};
