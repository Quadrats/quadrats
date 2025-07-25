import React, { useState, useCallback } from 'react';
import { Editor } from '@quadrats/core';
import { Card, CardAlignment } from '@quadrats/common/card';
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

export type CardModalValues = {
  alignment: CardAlignment;
  title: string;
  description: string;
  remark: string;
  linkText: string;
  linkUrl: string;
};

export interface CardModalProps {
  isOpen: boolean;
  close: VoidFunction;
  controller?: Card<Editor>;
  onConfirm: () => void;
}

const options: {
  value: CardAlignment;
  label: string;
}[] = [
  {
    value: 'leftImageRightText',
    label: '左圖右文',
  },
  {
    value: 'rightImageLeftText',
    label: '右圖左文',
  },
  {
    value: 'noImage',
    label: '純文字顯示',
  },
];

// TODO: i18n
export const CardModal = ({ isOpen, close, controller, onConfirm: onConfirmProps }: CardModalProps) => {
  const { message } = useMessage();
  const [values, setValues] = useState<CardModalValues>({
    alignment: 'leftImageRightText',
    title: '',
    description: '',
    remark: '',
    linkText: '',
    linkUrl: '',
  });

  const [imageUploaderItem, setImageUploaderItem] = useState<ImageUploaderItem | null>(null);
  const [haveLink, setHaveLink] = useState<boolean>(true);

  const onConfirm = useCallback(() => {
    onConfirmProps();
  }, [onConfirmProps]);

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
      onConfirm={onConfirm}
    >
      <div className="qdr-card-modal__block">
        <p className="qdr-card-modal__block-title">顯示設定</p>
        <SegmentedControl
          options={options}
          value={values.alignment}
          onChange={(value) => setValues((prev) => ({ ...prev, alignment: value as CardAlignment }))}
        />
      </div>
      <div className="qdr-card-modal__block">
        <p className="qdr-card-modal__block-title">基本設定</p>
        <div className="qdr-card-modal__block-content">
          <ImageUploader
            label="圖片"
            imageUploaderItem={imageUploaderItem}
            setImageUploaderItem={setImageUploaderItem}
            width={240}
            accept={controller?.accept}
            ratio={controller?.ratio}
            limitSize={controller?.limitSize}
            onOverLimitSize={() => {
              message({ type: 'error', content: '圖片檔案過大，檔案需小於 2MB' });
            }}
            onErrorAccept={() => {
              message({ type: 'error', content: '圖片類型錯誤' });
            }}
            required
          />
          <Input
            value={values.title}
            className="qdr-card-modal__block-field"
            onChange={(value) => setValues((prev) => ({ ...prev, title: value }))}
            label="標題"
            placeholder="請輸入標題"
            maxLength={30}
            required
          />
          <Textarea
            value={values.description}
            className="qdr-card-modal__block-field"
            onChange={(value) => setValues((prev) => ({ ...prev, description: value }))}
            label="簡述"
            placeholder="請輸入簡述"
            height={86}
            maxLength={50}
            required
          />
          <Input
            value={values.remark}
            className="qdr-card-modal__block-field"
            onChange={(value) => setValues((prev) => ({ ...prev, remark: value }))}
            label="備註"
            placeholder="請輸入備註資訊"
            maxLength={30}
          />
        </div>
      </div>
      <div className="qdr-card-modal__block">
        <div className="qdr-card-modal__block-title">
          <span>導連按鈕</span>
          <div className="qdr-card-modal__toggle-wrapper">
            <Toggle checked={haveLink} onChange={setHaveLink} />
            <span>顯示按鈕</span>
          </div>
        </div>
        <div className="qdr-card-modal__link-wrapper">
          <Input
            value={values.linkText}
            onChange={(value) => setValues((prev) => ({ ...prev, linkText: value }))}
            width={180}
            label="顯示文字"
            placeholder="請輸入顯示文字"
            maxLength={6}
            required
          />
          <Input
            value={values.linkUrl}
            onChange={(value) => setValues((prev) => ({ ...prev, linkUrl: value }))}
            className="qdr-card-modal__url-field"
            label="連結"
            placeholder="貼上連結，如 https://..."
            required
          />
        </div>
      </div>
    </Modal>
  );
};
