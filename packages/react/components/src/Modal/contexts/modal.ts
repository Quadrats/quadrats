import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { EmbedModalProps } from '../../../../embed/src';
import { CarouselModalProps } from '../../../../carousel/src';

export type ModalName = 'embed-modal' | 'carousel-modal' | '';

export interface EmbedModalConfig extends Omit<EmbedModalProps, 'isOpen' | 'close'> {}
export interface CarouselModalConfig extends Omit<CarouselModalProps, 'isOpen' | 'close'> {}

export interface ModalContextValue {
  isModalClosed: boolean;
  setIsModalClosed: Dispatch<SetStateAction<boolean>>;

  setEmbedModalConfig: (config: EmbedModalConfig) => void;
  setCarouselModalConfig: (config: CarouselModalConfig) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isModalClosed: false,
  setIsModalClosed: () => {},

  setEmbedModalConfig: () => {},
  setCarouselModalConfig: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}
