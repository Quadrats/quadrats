import React, { useState } from 'react';
import { Editor } from '@quadrats/core';
import { useSlateStatic } from 'slate-react';
import { Carousel } from '@quadrats/common/carousel';
import { Hints, Button, Modal } from '@quadrats/react/components';

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      }
    };

    reader.onerror = () => reject(reader.error);

    reader.readAsDataURL(file);
  });
}

function mockUpload(base64: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(async () => {
      resolve(base64);
    }, 1500);
  });
}

export interface CarouselModalProps {
  isOpen: boolean;
  close: VoidFunction;
  controller?: Carousel<Editor>;
}

export const CarouselModal = ({ isOpen, close, controller }: CarouselModalProps) => {
  const editor = useSlateStatic();
  const [uploading, setUploading] = useState(false);
  const [urls, setUrls] = useState<string[]>([]);

  console.log('uploading', uploading, urls);

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
                setUploading(true);

                await Promise.all(
                  files.map(async (f) => {
                    const base64 = await readFileAsBase64(f);
                    const url = await mockUpload(base64);

                    setUrls((prev) => [...prev, url]);
                  }),
                );

                setUploading(false);
              }
            }}
          >
            加入圖片
          </Button>
        </div>
      }
      customizedFooterElement={<div>{`已上傳 ${urls.length}/10`}</div>}
      disabledConfirmButton={uploading}
      onClose={() => {
        close();
      }}
      onConfirm={() => {
        console.log('urls', urls);
      }}
    >
      <div>建立輪播</div>
    </Modal>
  );
};
