import React, { ReactNode, useState, useCallback } from 'react';
import { ModalConfig, ModalContext } from './modal';
import Modal from '../index';

export interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({
  children,
}: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal: (config) => {
          setIsOpen(true);
          setModalConfig(config);
        },
        closeModal,
      }}
    >
      {children}
      <Modal
        isOpen={isOpen}
        onClose={closeModal}
        title={modalConfig?.title ?? ''}
        cancelText={modalConfig?.cancelText}
        confirmText={modalConfig?.confirmText}
        onConfirm={modalConfig?.onConfirm}
      >
        {modalConfig?.children}
      </Modal>
    </ModalContext.Provider>
  );
};

