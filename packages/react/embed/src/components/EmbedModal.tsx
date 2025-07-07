import React, { useState } from 'react';
import { useLocale } from '@quadrats/react';
import { Textarea, Input, Modal } from '@quadrats/react/components';

export const EmbedModal = ({
  isOpen,
  setIsOpen,
  setIsModalClosed,
  placeholder,
  confirmText,
  hint,
  type,
  onConfirm,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsModalClosed: React.Dispatch<React.SetStateAction<boolean>>;
  placeholder: string;
  confirmText: string;
  hint: string;
  type: 'input' | 'textarea';
  onConfirm: (value: string) => void;
}) => {
  const [value, setValue] = useState('');
  const locale = useLocale();

  return (
    <Modal
      isOpen={isOpen}
      title={locale.editor.embedTitle}
      confirmText={confirmText}
      onClose={() => {
        setIsOpen(false);
        setIsModalClosed(true);
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
