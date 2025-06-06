import { createContext, useContext } from 'react';
import { ModalProps } from '../index';

export interface ModalConfig extends Omit<ModalProps, 'isOpen' | 'onClose'> {}

export interface ModalContextValue {
  isOpen: boolean;
  openModal: (modalConfig: ModalConfig) => void;
  closeModal: VoidFunction;
}

export const ModalContext = createContext<ModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}