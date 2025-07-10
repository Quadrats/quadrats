/* eslint-disable max-len */
import React, { ReactNode, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Editor } from '@quadrats/core';
import { Carousel } from '@quadrats/common/carousel';
import { Plus } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';

interface FilesDropZoneProps {
  children: ReactNode;
  isOverMaxLength: boolean;
  controller?: Carousel<Editor>;
  uploadFiles: (files: File[]) => Promise<void>;
}

const FilesDropZone = ({ children, isOverMaxLength, controller, uploadFiles }: FilesDropZoneProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(false);

  const validateFile = useCallback(
    (file: File) => {
      if (!controller?.accept.includes(file.type)) {
        return false;
      }

      return true;
    },
    [controller?.accept],
  );

  const validateFiles = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      const files = Array.from(event.dataTransfer.files);

      if (!files || isOverMaxLength) {
        setError(true);

        return false;
      }

      return true;
    },
    [isOverMaxLength],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      setError(false);

      const files = Array.from(event.dataTransfer.files);

      if (!validateFiles(event)) {
        return;
      }

      const correctFiles = files.filter(
        (f) => validateFile(f) && controller?.limitSize && f.size <= controller.limitSize * 1024 * 1024,
      );

      await uploadFiles(correctFiles);
    },
    [validateFiles, uploadFiles, validateFile, controller?.limitSize],
  );

  return (
    <div
      className={clsx('qdr-carousel-modal__zone', {
        'qdr-carousel-modal__zone--error': error,
      })}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
        setError(false);
      }}
      onDragLeave={() => {
        setIsDragging(false);
        setError(false);
      }}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="qdr-carousel-modal__zone__wrapper">
          <div className="qdr-carousel-modal__zone__block">
            <div className="qdr-carousel-modal__zone__icon">
              <Icon icon={Plus} width={32} height={32} />
            </div>
            <div className="qdr-carousel-modal__zone__title">拖曳檔案到此上傳</div>
            <div className="qdr-carousel-modal__zone__hint">
              {controller?.ratio
                ? `僅能上傳 PNG 或 JPG；建議比例為 ${controller.ratio[0]}:${controller.ratio[1]} 且寬度至少達 2000px 以上；檔案大小不可超過 ${controller?.limitSize}MB`
                : `僅能上傳 PNG 或 JPG；檔案大小不可超過 ${controller?.limitSize}MB`}
            </div>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default FilesDropZone;
