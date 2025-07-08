import React, { ReactNode, useContext, useRef, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { CSSTransition } from 'react-transition-group';
import { useLocale, ThemeContext } from '@quadrats/react/configs';
import { Cancel } from '@quadrats/icons';
import Portal from '../Portal';
import Button from '../Button';
import Icon from '../Icon';

export interface ModalProps {
  title: string | ReactNode;
  closable?: boolean;
  children: ReactNode;
  mainAreaClassName?: string;
  sideAreaClassName?: string;
  mask?: boolean;
  maskClosable?: boolean;
  escToExit?: boolean;
  haveFooter?: boolean;
  sideChildren?: ReactNode;
  size?: 'small' | 'medium' | 'large' | 'extraLarge';
  isOpen: boolean;
  haveCloseButton?: boolean;
  haveConfirmButton?: boolean;
  disabledCloseButton?: boolean;
  disabledConfirmButton?: boolean;
  closeText?: string;
  confirmText?: string;
  onClose: () => void;
  onConfirm?: () => void;
  customizedFooterElement?: ReactNode;
}

const Modal = ({
  title,
  closable = false,
  children,
  mainAreaClassName,
  sideAreaClassName,
  mask = true,
  maskClosable = true,
  escToExit = true,
  haveFooter = true,
  sideChildren,
  size = 'medium',
  isOpen,
  haveCloseButton = true,
  haveConfirmButton = true,
  disabledCloseButton = false,
  disabledConfirmButton = false,
  closeText,
  confirmText,
  onClose,
  onConfirm,
  customizedFooterElement = <div />,
}: ModalProps) => {
  const locale = useLocale();
  const nodeRef = useRef(null);
  const { props: themeProps } = useContext(ThemeContext);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && escToExit) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, escToExit]);

  const renderFooter = useMemo(
    () => (
      <div className="qdr-modal__footer">
        {customizedFooterElement}
        <div className="qdr-modal__footer__actions">
          {haveCloseButton && (
            <Button variant="secondary" disabled={disabledCloseButton} onClick={onClose}>
              {closeText || locale.editor.cancel}
            </Button>
          )}
          {haveConfirmButton && (
            <Button variant="primary" disabled={disabledConfirmButton} onClick={onConfirm}>
              {confirmText || locale.editor.confirm}
            </Button>
          )}
        </div>
      </div>
    ),
    [
      customizedFooterElement,
      haveCloseButton,
      disabledCloseButton,
      onClose,
      closeText,
      locale.editor.cancel,
      locale.editor.confirm,
      haveConfirmButton,
      disabledConfirmButton,
      onConfirm,
      confirmText,
    ],
  );

  return (
    <Portal>
      <div
        className={clsx(
          'qdr-modal',
          {
            'qdr-modal--opened': isOpen,
            'qdr-modal--mask': mask,
          },
          themeProps.className,
        )}
        style={themeProps.style}
        onClick={maskClosable ? onClose : undefined}
      >
        <CSSTransition in={isOpen} nodeRef={nodeRef} timeout={250} classNames="qdr-modal__transition" unmountOnExit>
          <div
            ref={nodeRef}
            className={clsx('qdr-modal__container', `qdr-modal__container--${size}`)}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="qdr-modal__header">
              {title}
              {closable && (
                <Icon className="qdr-modal__header__cancel" icon={Cancel} width={24} height={24} onClick={onClose} />
              )}
            </div>
            <div className="qdr-modal__body">
              {sideChildren && (
                <div className="qdr-modal__side-body">
                  <div className={clsx('qdr-modal__side', sideAreaClassName)}>{sideChildren}</div>
                  {haveFooter && renderFooter}
                </div>
              )}
              <div className={clsx('qdr-modal__main', mainAreaClassName)}>{children}</div>
            </div>
            {haveFooter && !sideChildren && renderFooter}
          </div>
        </CSSTransition>
      </div>
    </Portal>
  );
};

export default Modal;
