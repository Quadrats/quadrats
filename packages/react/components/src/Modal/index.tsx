import React, { ReactNode, useContext, useRef } from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { ThemeContext } from '@quadrats/react/configs';
import { Cancel } from '@quadrats/icons';
import Portal from '../Portal';
import Button from '../Button';
import Icon from '../Icon';

export interface ModalProps {
  isOpen: boolean;
  cancelText?: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  children: ReactNode;
}

const Modal = ({
  isOpen,
  cancelText = '取消',
  confirmText = '確認',
  onClose,
  onConfirm,
  title,
  children,
}: ModalProps) => {
  const nodeRef = useRef(null);
  const { props: themeProps } = useContext(ThemeContext);

  return (
    <Portal>
      <div
        className={clsx(
          'qdr-modal',
          {
            'qdr-modal--opened': isOpen,
          },
          themeProps.className,
        )}
        style={themeProps.style}
        onClick={onClose}
      >
        <CSSTransition
          in={isOpen}
          nodeRef={nodeRef}
          timeout={250}
          classNames="qdr-modal__transition"
          unmountOnExit
        >
          <div ref={nodeRef} className="qdr-modal__container" onClick={e => e.stopPropagation()}>
            <div className="qdr-modal__header">
              {title}
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
              <Button variant="secondary" onClick={onClose}>{cancelText}</Button>
              <Button variant="primary" onClick={onConfirm}>{confirmText}</Button>
            </div>
          </div>
        </CSSTransition>
      </div>
    </Portal>
  );
};

export default Modal;