import React, { Dispatch, SetStateAction, ReactNode, useCallback, useState, useEffect } from 'react';
import { EmbedModal } from './EmbedModal/EmbedModal';
import { CarouselModal } from './CarouselModal/CarouselModal';
import { ConfirmModal } from './ConfirmModal/ConfirmModal';
import { ModalContext, ModalName, EmbedModalConfig, CarouselModalConfig, ConfirmModalConfig } from './modal';

export interface ModalProviderProps {
  children: ReactNode;
  needConfirmModal?: ConfirmModalConfig | null;
  setNeedConfirmModal?: Dispatch<SetStateAction<ConfirmModalConfig | null>>;
}

export const ModalProvider = ({ children, needConfirmModal, setNeedConfirmModal }: ModalProviderProps) => {
  const [modalName, setModalName] = useState<ModalName>('');
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [embedModalConfig, setEmbedModalConfig] = useState<EmbedModalConfig | null>(null);
  const [carouselModalConfig, setCarouselModalConfig] = useState<CarouselModalConfig | null>(null);
  const [confirmModalConfig, setConfirmModalConfig] = useState<ConfirmModalConfig | null>(null);

  const close = useCallback(() => {
    setModalName('');
    setIsModalClosed(true);

    if (needConfirmModal) {
      setNeedConfirmModal?.(null);
    }
  }, [needConfirmModal, setNeedConfirmModal]);

  useEffect(() => {
    if (needConfirmModal) {
      setModalName('confirm-modal');
      setConfirmModalConfig(needConfirmModal);
    }
  }, [needConfirmModal]);

  return (
    <ModalContext.Provider
      value={{
        isModalClosed,
        setIsModalClosed,
        setEmbedModalConfig: (config) => {
          setModalName('embed-modal');
          setEmbedModalConfig(config);
        },
        setCarouselModalConfig: (config) => {
          setModalName('carousel-modal');
          setCarouselModalConfig(config);
        },
        setConfirmModalConfig: (config) => {
          setModalName('confirm-modal');
          setConfirmModalConfig(config);
        },
      }}
    >
      {children}
      <EmbedModal
        isOpen={modalName === 'embed-modal'}
        close={close}
        placeholder={embedModalConfig?.placeholder || ''}
        confirmText={embedModalConfig?.confirmText || ''}
        hint={embedModalConfig?.hint || ''}
        type={embedModalConfig?.type || 'input'}
        onConfirm={(value) => {
          embedModalConfig?.onConfirm?.(value);
        }}
      />
      <CarouselModal
        isOpen={modalName === 'carousel-modal'}
        close={close}
        controller={carouselModalConfig?.controller}
        initialValue={carouselModalConfig?.initialValue}
        onConfirm={carouselModalConfig?.onConfirm}
      />
      <ConfirmModal
        isOpen={modalName === 'confirm-modal'}
        close={close}
        title={confirmModalConfig?.title ?? ''}
        content={confirmModalConfig?.content ?? ''}
        confirmText={confirmModalConfig?.confirmText ?? ''}
        onConfirm={confirmModalConfig?.onConfirm}
        haveFooter={confirmModalConfig?.haveFooter}
        mask={confirmModalConfig?.mask}
        maskClosable={confirmModalConfig?.maskClosable}
        escToExit={confirmModalConfig?.escToExit}
      />
    </ModalContext.Provider>
  );
};
