import React, { useState } from 'react';
import {
  Textarea,
  Input,
  Modal,
  SegmentedControl,
  Toggle,
  ImageUploader,
  ImageUploaderItem,
} from '@quadrats/react/components';
import { useMessage } from '../../message/message';

export interface CardModalProps {
  isOpen: boolean;
  close: VoidFunction;
  onConfirm: () => void;
}

// TODO: i18n
export const CardModal = ({ isOpen, close, onConfirm }: CardModalProps) => {
  const { message } = useMessage();
  const [alignment, setAlignment] = useState('left');
  const [imageUploaderItem, setImageUploaderItem] = useState<ImageUploaderItem | null>(null);
  const [titleValue, setTitleValue] = useState('');
  const [descriptionValue, setDescriptionValue] = useState('');
  const [remarkValue, setRemarkValue] = useState('');
  const [haveLink, setHaveLink] = useState<boolean>(true);

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
      <SegmentedControl
        options={[
          {
            value: 'left',
            label: '左圖右文',
          },
          {
            value: 'right',
            label: '右圖左文',
          },
          {
            value: 'none',
            label: '沒有圖',
          },
        ]}
        value={alignment}
        onChange={setAlignment}
      />
      <ImageUploader
        imageUploaderItem={imageUploaderItem}
        setImageUploaderItem={setImageUploaderItem}
        width={240}
        ratio={[3, 2]}
        limitSize={2}
        onOverLimitSize={() => {
          message({ type: 'error', content: '圖片檔案過大，檔案需小於 2MB' });
        }}
        onErrorAccept={() => {
          message({ type: 'error', content: '圖片類型錯誤' });
        }}
      />
      <Input
        value={titleValue}
        onChange={setTitleValue}
        label="標題"
        placeholder="請輸入標題"
        maxLength={30}
        required
      />
      <Textarea
        value={descriptionValue}
        onChange={setDescriptionValue}
        label="簡述"
        placeholder="請輸入簡述"
        height={86}
        maxLength={50}
        required
      />
      <Input value={remarkValue} onChange={setRemarkValue} label="備註" placeholder="請輸入備註資訊" maxLength={30} />
      <Toggle checked={haveLink} onChange={setHaveLink} />
    </Modal>
  );
};
