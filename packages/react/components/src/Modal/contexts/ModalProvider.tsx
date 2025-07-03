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

  const onClose = useCallback(() => {
    closeModal();

    if (modalConfig?.onClose) {
      modalConfig.onClose();
    }
  }, [closeModal, modalConfig?.onClose]);

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
        {...modalConfig}
        isOpen={isOpen}
        onClose={onClose}
        title={modalConfig?.title ?? ''}
      >
        {modalConfig?.children}
      </Modal>
    </ModalContext.Provider>
  );
};

