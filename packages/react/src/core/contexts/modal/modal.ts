import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { EmbedModalProps } from './EmbedModal/EmbedModal';
import { CarouselModalProps } from './CarouselModal/CarouselModal';
import { CardModalProps } from './CardModal/CardModal';
import { ConfirmModalProps } from './ConfirmModal/ConfirmModal';

export type ModalName = 'embed-modal' | 'carousel-modal' | 'card-modal' | 'confirm-modal' | '';

export interface EmbedModalConfig extends Omit<EmbedModalProps, 'isOpen' | 'close'> {}
export interface CarouselModalConfig extends Omit<CarouselModalProps, 'isOpen' | 'close'> {}
export interface CardModalConfig extends Omit<CardModalProps, 'isOpen' | 'close'> {}
export interface ConfirmModalConfig extends Omit<ConfirmModalProps, 'isOpen' | 'close'> {}

export interface ModalContextValue {
  isModalClosed: boolean;
  setIsModalClosed: Dispatch<SetStateAction<boolean>>;

  setEmbedModalConfig: (config: EmbedModalConfig) => void;
  setCarouselModalConfig: (config: CarouselModalConfig) => void;
  setCardModalConfig: (config: CardModalConfig) => void;
  setConfirmModalConfig: (config: ConfirmModalConfig) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isModalClosed: false,
  setIsModalClosed: () => {},

  setEmbedModalConfig: () => {},
  setCarouselModalConfig: () => {},
  setCardModalConfig: () => {},
  setConfirmModalConfig: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}
