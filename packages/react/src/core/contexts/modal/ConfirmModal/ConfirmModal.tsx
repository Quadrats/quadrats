import React from 'react';
import { useLocale } from '@quadrats/react/configs';
import { Modal, Icon, Button } from '@quadrats/react/components';
import { Warning } from '@quadrats/icons';

export interface ConfirmModalProps {
  isOpen: boolean;
  close: VoidFunction;
  title: string;
  content: string;
  confirmText: string;
  onConfirm?: () => void;
  haveFooter?: boolean;
  mask?: boolean;
  maskClosable?: boolean;
  escToExit?: boolean;
}

export const ConfirmModal = ({
  isOpen,
  title,
  content,
  confirmText,
  close,
  onConfirm,
  haveFooter = true,
  mask,
  maskClosable,
  escToExit,
}: ConfirmModalProps) => {
  const locale = useLocale();

  return (
    <Modal
      isOpen={isOpen}
      className="qdr-confirm-modal"
      size="small"
      mask={mask}
      maskClosable={maskClosable}
      escToExit={escToExit}
      onClose={() => {
        close();
      }}
      haveFooter={false}
    >
      <div className="qdr-confirm-modal__container">
        <Icon icon={Warning} width={28} height={28} className="qdr-confirm-modal__icon" />
        <div className="qdr-confirm-modal__body">
          <div className="qdr-confirm-modal__title">{title}</div>
          <div className="qdr-confirm-modal__content">{content}</div>
        </div>
      </div>
      {haveFooter && (
        <div className="qdr-confirm-modal__footer">
          <Button variant="secondary" onClick={close}>
            {locale.editor.cancel}
          </Button>
          <Button variant="primary" danger onClick={onConfirm}>
            {confirmText || locale.editor.confirm}
          </Button>
        </div>
      )}
    </Modal>
  );
};
