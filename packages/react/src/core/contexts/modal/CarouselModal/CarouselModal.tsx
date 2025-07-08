import React, { useState } from 'react';
import { Editor } from '@quadrats/core';
import { useSlateStatic } from 'slate-react';
import { Carousel } from '@quadrats/common/carousel';
import { Hints, Button, Modal } from '@quadrats/react/components';

export interface CarouselModalProps {
  isOpen: boolean;
  close: VoidFunction;
  controller?: Carousel<Editor>;
}

export const CarouselModal = ({ isOpen, close, controller }: CarouselModalProps) => {
  const editor = useSlateStatic();
  const [targetFiles, setTargetFiles] = useState<File[]>([]);

  return (
    <Modal
      isOpen={isOpen}
      title="建立輪播"
      size="extraLarge"
      closable
      haveCloseButton={false}
      confirmText="建立輪播"
      sideChildren={
        <div>
          上傳建議
          <Hints
            hints={[
              {
                text: `數量限制：至少 1 張，至多 ${controller?.maxLength} 張。`,
              },
              {
                text: `檔案大小：不可大於 ${controller?.limitSize} MB。`,
              },
            ]}
          />
          <Button
            variant="outlined"
            onClick={async () => {
              const files = await controller?.selectFiles(editor);

              if (files) {
                setTargetFiles(files);
              }
            }}
          >
            加入圖片
          </Button>
        </div>
      }
      customizedFooterElement={<div>{`已上傳 ${targetFiles.length}/10`}</div>}
      onClose={() => {
        close();
      }}
      onConfirm={() => {
        console.log('targetFiles', targetFiles);
      }}
    >
      <div>建立輪播</div>
    </Modal>
  );
};
