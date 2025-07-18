/* eslint-disable max-len */
import React, { useMemo, useCallback, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import { Editor } from '@quadrats/core';
import { Plus, Upload } from '@quadrats/icons';
import { useSlateStatic } from 'slate-react';
import { Carousel, CarouselFieldArrayItem } from '@quadrats/common/carousel';
import { Hints, Button, Modal, Icon } from '@quadrats/react/components';
import FilesDropZone from './FilesDropZone';
import CarouselItem from './CarouselItem';

function usePreviousValue<T>(value: T): T {
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}

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

function upload(base64: string, onProgress: (percent: number) => void): Promise<string> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      onProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => resolve(base64), 200);
      }
    }, 250);
  });
}

export interface CarouselModalProps {
  isOpen: boolean;
  close: VoidFunction;
  controller?: Carousel<Editor>;
  initialValue?: CarouselFieldArrayItem[];
  onConfirm?: (items: CarouselFieldArrayItem[]) => void;
}

export const CarouselModal = ({ isOpen, close, controller, initialValue = [], onConfirm }: CarouselModalProps) => {
  const editor = useSlateStatic();
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [items, setItems] = useState<CarouselFieldArrayItem[]>([]);
  const prevIsOpen = usePreviousValue(isOpen);

  useEffect(() => {
    if (!prevIsOpen && isOpen && initialValue.length > 0) {
      setItems(initialValue);
    }
  }, [initialValue, isOpen, prevIsOpen]);

  useEffect(() => {
    if (items.some((i) => i.progress !== 100)) {
      setUploading(true);
    } else {
      setUploading(false);
    }
  }, [items]);

  const isOverMaxLength = useMemo(() => {
    if (controller?.maxLength) {
      return items.length >= controller.maxLength;
    }

    return false;
  }, [controller?.maxLength, items.length]);

  const disabledConfirm = useMemo(() => {
    const basicCondition = items.length === 0 || uploading;

    if (controller?.maxLength) {
      return basicCondition || items.length > controller.maxLength;
    }

    return basicCondition;
  }, [controller?.maxLength, items.length, uploading]);

  const uploadFiles = useCallback(async (files: File[]) => {
    if (files) {
      const items: CarouselFieldArrayItem[] = [];

      for (const file of files) {
        const base64 = await readFileAsBase64(file);

        items.push({ file, url: '', caption: '', preview: base64, progress: 0 });
      }

      setItems((prev) => [...prev, ...items]);

      for (const item of items) {
        const onProgress = (p: number) => {
          setItems((prev) => prev.map((u) => (u.file === item.file ? { ...u, progress: p } : u)));
        };

        const url = await upload(item.preview, onProgress);

        setItems((prev) => prev.map((u) => (u.file === item.file ? { ...u, preview: url, url } : u)));
      }
    }
  }, []);

  const change = useCallback((index: number, image: Omit<CarouselFieldArrayItem, 'progress' | 'preview' | 'file'>) => {
    setItems((prev) => {
      const updated = [...prev];

      updated[index] = { ...updated[index], ...image };

      return updated;
    });
  }, []);

  const remove = useCallback((index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const swap = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const updated = [...prev];
      const temp = updated[from];

      updated[from] = updated[to];
      updated[to] = temp;

      return updated;
    });
  }, []);

  // TODO: i18n

  return (
    <Modal
      isOpen={isOpen}
      title="建立輪播"
      size="extraLarge"
      closable={!uploading}
      maskClosable={!uploading}
      haveCloseButton={false}
      confirmText="建立輪播"
      mainAreaClassName="qdr-carousel-modal__main"
      sideChildren={
        <div className="qdr-carousel-modal__side">
          <div className="qdr-carousel-modal__side__hints-wrapper">
            <div className="qdr-carousel-modal__side__hints-title">上傳建議</div>
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
            className="qdr-carousel-modal__side__upload"
            variant="outlined"
            size="large"
            disabled={isOverMaxLength}
            prefix={<Icon icon={Plus} width={24} height={24} />}
            onClick={async () => {
              const files = await controller?.selectFiles(editor);

              if (files) {
                const correctFiles = files.filter(
                  (f) => controller?.limitSize && f.size <= controller.limitSize * 1024 * 1024,
                );

                await uploadFiles(correctFiles);
              }
            }}
          >
            加入圖片
          </Button>
        </div>
      }
      customizedFooterElement={
        <div className="qdr-carousel-modal__counter">
          {`已上傳 ${items.filter((i) => i.progress === 100).length}/${controller?.maxLength}`}
        </div>
      }
      disabledConfirmButton={disabledConfirm}
      onClose={() => {
        close();
        setItems([]);
      }}
      onConfirm={() => {
        close();
        setItems([]);

        setTimeout(() => {
          onConfirm?.(items);
        }, 0);
      }}
    >
      <DndProvider backend={HTML5Backend}>
        <FilesDropZone
          isDragging={isDragging}
          setIsDragging={setIsDragging}
          isOverMaxLength={isOverMaxLength}
          controller={controller}
          uploadFiles={uploadFiles}
        >
          {items.length > 0 ? (
            <div
              className={clsx('qdr-carousel-modal__grid', {
                'qdr-carousel-modal__grid--isDragging': isDragging,
              })}
            >
              {items.map((item, index) => (
                <CarouselItem
                  key={`${item.url}-${item.caption || ''}-${index}`}
                  url={item.url}
                  preview={item.preview}
                  progress={item.progress}
                  caption={item.caption}
                  index={index}
                  ratio={controller?.ratio}
                  onChange={(value) => {
                    change(index, { url: item.url, caption: value });
                  }}
                  onRemove={() => {
                    remove(index);
                  }}
                  swap={swap}
                />
              ))}
            </div>
          ) : (
            <div className="qdr-carousel-modal__placeholder">
              <div className="qdr-carousel-modal__placeholder__block">
                <div className="qdr-carousel-modal__placeholder__icon">
                  <Icon icon={Upload} width={32} height={32} />
                </div>
                <div className="qdr-carousel-modal__placeholder__title">拖曳檔案到此上傳</div>
                <div className="qdr-carousel-modal__placeholder__hint">
                  {controller?.ratio
                    ? `僅能上傳 PNG 或 JPG；建議比例為 ${controller.ratio[0]}:${controller.ratio[1]} 且寬度至少達 2000px 以上；檔案大小不可超過 ${controller?.limitSize}MB`
                    : `僅能上傳 PNG 或 JPG；檔案大小不可超過 ${controller?.limitSize}MB`}
                </div>
              </div>
            </div>
          )}
        </FilesDropZone>
      </DndProvider>
    </Modal>
  );
};
