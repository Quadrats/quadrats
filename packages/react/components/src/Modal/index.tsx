import React, { ReactNode } from 'react';
import ReactDOM from 'react-dom';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({
  onClose,
  children,
}: ModalProps) => {
  return ReactDOM.createPortal(
    <div className="qdr-modal" onClick={onClose}>
      <div className="qdr-modal__container">
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;