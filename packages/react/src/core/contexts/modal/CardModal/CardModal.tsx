import React, { useState } from 'react';
import { Textarea, Input, Modal } from '@quadrats/react/components';

export interface CardModalProps {
  isOpen: boolean;
  close: VoidFunction;
  onConfirm: () => void;
}

// TODO: i18n
export const CardModal = ({ isOpen, close, onConfirm }: CardModalProps) => {
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [remarkValue, setRemarkValue] = useState('');

  return (
    <Modal
      isOpen={isOpen}
      size="medium"
      title="建立卡片"
      confirmText="建立卡片"
      mainAreaClassName="qdr-card-modal__main"
      onClose={() => {
        close();
      }}
      onConfirm={() => {
        onConfirm();
      }}
    >
      <Input value={titleValue} onChange={setTitleValue} label="標題" placeholder="請輸入標題" maxLength={30} />
      <Textarea
        value={descriptionValue}
        onChange={setDescriptionValue}
        label="簡述"
        placeholder="請輸入簡述"
        height={86}
        maxLength={50}
      />
      <Input value={remarkValue} onChange={setRemarkValue} label="備註" placeholder="請輸入備註資訊" maxLength={30} />
    </Modal>
  );
};
