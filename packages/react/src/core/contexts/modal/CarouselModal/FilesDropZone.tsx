import React, { Dispatch, SetStateAction, ReactNode, useCallback } from 'react';
import clsx from 'clsx';
import { Editor } from '@quadrats/core';
import { Carousel } from '@quadrats/common/carousel';
import { Upload } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { useMessage } from '../../message/message';

interface FilesDropZoneProps {
  isDragging: boolean;
  setIsDragging: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  isOverMaxLength: boolean;
  controller?: Carousel<Editor>;
  uploadFiles: (files: File[]) => Promise<void>;
}

const FilesDropZone = ({
  isDragging,
  setIsDragging,
  children,
  isOverMaxLength,
  controller,
  uploadFiles,
}: FilesDropZoneProps) => {
  const { message } = useMessage();

  const validateFile = useCallback(
    (file: File) => {
      if (!controller?.accept.find((a) => a === file.type)) {
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
        if (isOverMaxLength) {
          message({ type: 'error', content: '超過數量上限，請刪除已存在圖片' });
        }

        return false;
      }

      return true;
    },
    [isOverMaxLength, message],
  );

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      if (event.dataTransfer?.types?.includes('Files')) {
        event.preventDefault();
        setIsDragging(false);

        const files = Array.from(event.dataTransfer.files);

        if (!validateFiles(event)) {
          return;
        }

        const correctFiles = files.filter(
          (f) => validateFile(f) && controller?.limitSize && f.size <= controller.limitSize * 1024 * 1024,
        );

        if (files.find((f) => !validateFile(f))) {
          message({ type: 'error', content: '檔案類型錯誤。' });
        }

        if (files.find((f) => controller?.limitSize && f.size > controller.limitSize * 1024 * 1024)) {
          message({ type: 'error', content: `圖片檔案過大，檔案需小於 ${controller?.limitSize}MB` });
        }

        if (correctFiles.length > 0) {
          await uploadFiles(correctFiles);
        }
      }
    },
    [setIsDragging, validateFiles, validateFile, controller?.limitSize, message, uploadFiles],
  );

  // TODO: i18n

  return (
    <div
      className={clsx('qdr-carousel-modal__zone')}
      onDragOver={(e) => {
        e.preventDefault();

        if (e.dataTransfer?.types?.includes('Files')) {
          setIsDragging(true);
        }
      }}
      onDragLeave={() => {
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className="qdr-carousel-modal__zone__wrapper">
          <div className="qdr-carousel-modal__zone__block">
            <Icon icon={Upload} width={24} height={24} />
            將檔案拖曳到這裡即可上傳
          </div>
        </div>
      )}
      {children}
    </div>
  );
};

export default FilesDropZone;
