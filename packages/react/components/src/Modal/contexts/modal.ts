import { createContext, useContext, Dispatch, SetStateAction } from 'react';
import { EmbedModalProps } from '../../../../embed/src';

export type ModalName = 'embed-modal' | '';

export interface EmbedModalConfig extends Omit<EmbedModalProps, 'isOpen' | 'close'> {}

export interface ModalContextValue {
  isModalClosed: boolean;
  setIsModalClosed: Dispatch<SetStateAction<boolean>>;

  setEmbedModalConfig: (config: EmbedModalConfig) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isModalClosed: false,
  setIsModalClosed: () => {},

  setEmbedModalConfig: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}
