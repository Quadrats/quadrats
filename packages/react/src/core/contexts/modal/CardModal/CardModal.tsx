import React from 'react';
import { Modal } from '@quadrats/react/components';
import { useLocale } from '@quadrats/react/configs';

export interface CardModalProps {
  isOpen: boolean;
  close: VoidFunction;
  confirmText: string;
  onConfirm: () => void;
}

export const CardModal = ({ isOpen, close, confirmText, onConfirm }: CardModalProps) => {
  const locale = useLocale();

  return (
    <Modal
      isOpen={isOpen}
      title={locale.editor.embedTitle}
      confirmText={confirmText}
      onClose={() => {
        close();
      }}
      onConfirm={() => {
        onConfirm();
      }}
    >
      CardModal
    </Modal>
  );
};
