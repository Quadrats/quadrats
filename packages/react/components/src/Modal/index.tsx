import React, { ReactNode, useContext } from 'react';
import clsx from 'clsx';
import { ThemeContext } from '@quadrats/react';
import { Cancel } from '@quadrats/icons';
import Portal from '../Portal';
import Icon from '../Icon';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal = ({
  onClose,
  children,
}: ModalProps) => {
  const { props: themeProps } = useContext(ThemeContext);

  return (
    <Portal>
      <div
        className={clsx(
          'qdr-modal',
          themeProps.className,
        )}
        style={themeProps.style}
        onClick={onClose}
      >
        <div className="qdr-modal__container">
          <div className="qdr-modal__header">
            Modal Title
            <Icon
              className="qdr-modal__header__cancel"
              icon={Cancel}
              width={24}
              height={24}
              onClick={onClose}
            />
          </div>
          <div className="qdr-modal__body">
            {children}
          </div>
          <div className="qdr-modal__footer">
            Modal Footer
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;