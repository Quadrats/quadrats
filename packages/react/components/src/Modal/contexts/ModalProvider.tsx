import React, { ReactNode, useCallback, useState } from 'react';
import { EmbedModal } from '../../../../embed/src';
import { CarouselModal } from '../../../../carousel/src';
import { ModalContext, ModalName, EmbedModalConfig, CarouselModalConfig } from './modal';

export interface ModalProviderProps {
  children: ReactNode;
}

export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [modalName, setModalName] = useState<ModalName>('');
  const [isModalClosed, setIsModalClosed] = useState<boolean>(false);
  const [embedModalConfig, setEmbedModalConfig] = useState<EmbedModalConfig | null>(null);
  const [carouselModalConfig, setCarouselModalConfig] = useState<CarouselModalConfig | null>(null);

  const close = useCallback(() => {
    setModalName('');
    setIsModalClosed(true);
  }, []);

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
      />
    </ModalContext.Provider>
  );
};
