import React, { Dispatch, SetStateAction, ReactNode, useCallback, useState, useEffect } from 'react';
import { EmbedModal } from './EmbedModal/EmbedModal';
import { CarouselModal } from './CarouselModal/CarouselModal';
import { CardModal } from './CardModal/CardModal';
import { ConfirmModal } from './ConfirmModal/ConfirmModal';
import {
  ModalContext,
  ModalName,
  EmbedModalConfig,
  CarouselModalConfig,
  CardModalConfig,
  ConfirmModalConfig,
} from './modal';

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
  const [cardModalConfig, setCardModalConfig] = useState<CardModalConfig | null>(null);
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
        setCardModalConfig: (config) => {
          setModalName('card-modal');
          setCardModalConfig(config);
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
      <CardModal
        isOpen={modalName === 'card-modal'}
        close={close}
        onConfirm={() => {
          cardModalConfig?.onConfirm?.();
        }}
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
