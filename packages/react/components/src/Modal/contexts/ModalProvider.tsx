import React, { ReactNode, useState, useCallback } from 'react';
import { ModalConfig, ModalContext } from './modal';
import Modal from '../index';

export interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalComponent, setModalComponent] = useState<ReactNode>(null);

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
  }, [closeModal, modalConfig]);

  return (
    <ModalContext.Provider
      value={{
        isOpen,
        openModal: (config) => {
          setIsOpen(true);
          setModalConfig(config);
        },
        closeModal,
        appendModal: (modal) => {
          setModalComponent(modal);
        },
      }}
    >
      {children}
      {modalComponent}
      <Modal {...modalConfig} isOpen={isOpen} onClose={onClose} title={modalConfig?.title ?? ''}>
        {modalConfig?.children}
      </Modal>
    </ModalContext.Provider>
  );
};
