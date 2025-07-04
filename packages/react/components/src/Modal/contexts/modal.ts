import { createContext, useContext, ReactNode } from 'react';
import { ModalProps } from '../index';

export interface ModalConfig extends Omit<ModalProps, 'isOpen' | 'onClose'> {
  onClose?: VoidFunction;
}

export interface ModalContextValue {
  isOpen: boolean;
  openModal: (modalConfig: ModalConfig) => void;
  closeModal: VoidFunction;
  appendModal: (modal: ReactNode) => void;
}

export const ModalContext = createContext<ModalContextValue>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
  appendModal: () => {},
});

export function useModal() {
  return useContext(ModalContext);
}
