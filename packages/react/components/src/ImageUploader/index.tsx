import React, { useState, useMemo, useCallback } from 'react';
import { ImageAccept } from '@quadrats/common/file-uploader';
import clsx from 'clsx';
import { Plus } from '@quadrats/icons';
import Icon from '../Icon';
import { Hints } from '../Hint';

export interface ImageUploaderProps {
  width?: number;
  accept?: ImageAccept[];
  ratio?: [number, number];
  limitSize?: number;
  disabled?: boolean;
  onOverLimitSize?: VoidFunction;
}

// TODO: i18n
const ImageUploader = ({
  width = 140,
  accept = ['image/jpeg', 'image/jpg', 'image/png'],
  ratio,
  limitSize = 5,
  disabled = false,
  onOverLimitSize,
}: ImageUploaderProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  const onSelectFile = useCallback(async () => {
    setIsError(false);

    return new Promise<File | undefined>((resolve) => {
      const inputEl = document.createElement('input');

      if (accept) {
        inputEl.accept = accept.join(',');
      }

      inputEl.multiple = false;
      inputEl.type = 'file';

      inputEl.addEventListener('cancel', () => {
        resolve(undefined);
      });

      inputEl.addEventListener('change', () => {
        const { files: fileList } = inputEl;

        if (!fileList || !fileList.length) {
          resolve(undefined);
        } else {
          resolve(fileList[0]);
        }
      });

      inputEl.click();
    });
  }, [accept]);

  const onUpload = useCallback(async () => {
    const file = await onSelectFile();

    if (file) {
      if (file.size > limitSize * 1024 * 1024) {
        setIsError(true);
        onOverLimitSize?.();
      }
    }
  }, [limitSize, onOverLimitSize, onSelectFile]);

  const acceptText = useMemo(() => {
    if (accept.find((a) => a === 'image/jpeg' || a === 'image/jpg') && accept.find((a) => a === 'image/png')) {
      return '檔案格式：限 JPG 或 PNG。';
    } else if (accept.find((a) => a === 'image/png')) {
      return '檔案格式：限 PNG。';
    } else if (accept.find((a) => a === 'image/jpeg' || a === 'image/jpg')) {
      return '檔案格式：限 JPG。';
    }

    return '';
  }, [accept]);

  return (
    <div className="qdr-image-uploader__wrapper">
      <div
        className={clsx('qdr-image-uploader', {
          'qdr-image-uploader--error': isError,
          'qdr-image-uploader--disabled': disabled,
        })}
        style={{ width, aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1' }}
        onClick={onUpload}
      >
        <Icon icon={Plus} width={24} height={24} className="qdr-image-uploader__icon" />
        <span className="qdr-image-uploader__main-text">上傳</span>
      </div>
      <Hints
        style={{ width }}
        hints={[
          {
            text: acceptText,
          },
          ratio && {
            text: `檔案尺寸：最佳比例為 ${ratio[0]}:${ratio[1]}。建議圖片寬度達 2000px 以上，高度不限。`,
          },
          {
            text: `檔案大小：不可大於 ${limitSize} MB。`,
          },
        ].filter((h) => !!h)}
      />
    </div>
  );
};

export default ImageUploader;
