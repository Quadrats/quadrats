import React, { useState } from 'react';
import { Editor } from '@quadrats/core';
import { Plus } from '@quadrats/icons';
import { useSlateStatic } from 'slate-react';
import { Carousel } from '@quadrats/common/carousel';
import { Hints, Button, Modal, Icon } from '@quadrats/react/components';

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
      mainAreaClassName="qdr-embed-modal__main"
      sideChildren={
        <div className="qdr-embed-modal__side">
          <div className="qdr-embed-modal__side__hints-wrapper">
            <div className="qdr-embed-modal__side__hints-title">上傳建議</div>
            <Hints
              hints={[
                {
                  text: `數量限制：至少 1 張，至多 ${controller?.maxLength} 張。`,
                },
                {
                  text: '檔案格式：限 JPG 或 PNG。',
                },
                controller?.ratio && {
                  text: `檔案尺寸：最佳比例為 ${controller.ratio[0]}:${controller.ratio[1]}。建議圖片寬度達 2000px 以上，高度不限。`,
                },
                {
                  text: `檔案大小：不可大於 ${controller?.limitSize} MB。`,
                },
              ].filter((h) => !!h)}
            />
          </div>
          <Button
            className="qdr-embed-modal__side__upload"
            variant="outlined"
            size="large"
            prefix={<Icon icon={Plus} width={24} height={24} />}
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
