import React from 'react';
import { Modal } from '@quadrats/react/components';

export interface ConfirmModalProps {
  isOpen: boolean;
  close: VoidFunction;
  title: string;
  content: string;
  confirmText: string;
  onConfirm: () => void;
}

export const ConfirmModal = ({ isOpen, close, title, content, confirmText, onConfirm }: ConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      confirmText={confirmText}
      size="small"
      onClose={() => {
        close();
      }}
      onConfirm={onConfirm}
      dangerConfirmButton
    >
      {title}
      {content}
    </Modal>
  );
};
