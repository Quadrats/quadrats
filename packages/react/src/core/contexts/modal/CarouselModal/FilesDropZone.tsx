import React, { Dispatch, SetStateAction, ReactNode, useState, useCallback } from 'react';
import clsx from 'clsx';
import { Editor } from '@quadrats/core';
import { Carousel } from '@quadrats/common/carousel';
import { Upload } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';

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
      if (event.dataTransfer?.types?.includes('Files')) {
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
      }
    },
    [setIsDragging, validateFiles, uploadFiles, validateFile, controller?.limitSize],
  );

  // TODO: i18n

  return (
    <div
      className={clsx('qdr-carousel-modal__zone', {
        'qdr-carousel-modal__zone--error': error,
      })}
      onDragOver={(e) => {
        e.preventDefault();

        if (e.dataTransfer?.types?.includes('Files')) {
          setIsDragging(true);
          setError(false);
        }
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
