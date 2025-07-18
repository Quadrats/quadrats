import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { EmbedModalProps } from './EmbedModal/EmbedModal';
import { CarouselModalProps } from './CarouselModal/CarouselModal';
import { ConfirmModalProps } from './ConfirmModal/ConfirmModal';

export type ModalName = 'embed-modal' | 'carousel-modal' | 'confirm-modal' | '';

export interface EmbedModalConfig extends Omit<EmbedModalProps, 'isOpen' | 'close'> {}
export interface CarouselModalConfig extends Omit<CarouselModalProps, 'isOpen' | 'close'> {}
export interface ConfirmModalConfig extends Omit<ConfirmModalProps, 'isOpen' | 'close'> {}

export interface ModalContextValue {
  isModalClosed: boolean;
  setIsModalClosed: Dispatch<SetStateAction<boolean>>;

  setEmbedModalConfig: (config: EmbedModalConfig) => void;
  setCarouselModalConfig: (config: CarouselModalConfig) => void;
  setConfirmModalConfig: (config: ConfirmModalConfig) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isModalClosed: false,
  setIsModalClosed: () => {},

  setEmbedModalConfig: () => {},
  setCarouselModalConfig: () => {},
  setConfirmModalConfig: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}
