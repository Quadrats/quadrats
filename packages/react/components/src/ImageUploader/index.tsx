import React, { Dispatch, SetStateAction, useState, useMemo, useCallback } from 'react';
import { ImageAccept } from '@quadrats/common/file-uploader';
import { readFileAsBase64, mockUpload } from '@quadrats/react/utils';
import { Trash } from '@quadrats/icons';
import clsx from 'clsx';
import { Plus, Image } from '@quadrats/icons';
import Icon from '../Icon';
import { Hints } from '../Hint';
import Progress from '../Progress';

export type ImageUploaderItem = {
  file: File;
  progress: number;
  preview: string;
  url: string;
};

export interface ImageUploaderProps {
  imageUploaderItem: ImageUploaderItem | null;
  setImageUploaderItem: Dispatch<SetStateAction<ImageUploaderItem | null>>;
  width?: number;
  accept?: ImageAccept[];
  ratio?: [number, number];
  limitSize?: number;
  disabled?: boolean;
  onOverLimitSize?: VoidFunction;
}

// TODO: i18n
const ImageUploader = ({
  imageUploaderItem,
  setImageUploaderItem,
  width = 140,
  accept = ['image/jpeg', 'image/jpg', 'image/png'],
  ratio,
  limitSize = 5,
  disabled = false,
  onOverLimitSize,
}: ImageUploaderProps) => {
  const [isError, setIsError] = useState<boolean>(false);

  console.log('imageUploaderItem', imageUploaderItem);

  const onProgress = useCallback(
    (p: number) => {
      setImageUploaderItem((prev) => {
        if (prev) {
          return {
            ...prev,
            progress: p,
          };
        }

        return prev;
      });
    },
    [setImageUploaderItem],
  );

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
    if (!disabled && !imageUploaderItem) {
      const file = await onSelectFile();

      if (file) {
        if (file.size > limitSize * 1024 * 1024) {
          setIsError(true);
          onOverLimitSize?.();
        } else {
          const base64 = await readFileAsBase64(file);

          setImageUploaderItem(() => ({
            file,
            preview: base64,
            url: '',
            progress: 0,
          }));

          try {
            const url = await mockUpload(base64, onProgress);

            setImageUploaderItem((prev) => {
              if (prev) {
                return {
                  ...prev,
                  preview: url,
                  url,
                };
              }

              return prev;
            });
          } catch (error) {
            setIsError(true);
            setImageUploaderItem(() => null);
          }
        }
      }
    }
  }, [disabled, imageUploaderItem, limitSize, onOverLimitSize, onProgress, onSelectFile, setImageUploaderItem]);

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
      {imageUploaderItem ? (
        <div
          className="qdr-image-uploader qdr-image-uploader__previewer"
          style={{ width, aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1' }}
        >
          <div className="qdr-image-uploader__image-wrapper">
            {imageUploaderItem.progress !== 100 && <Progress percentage={imageUploaderItem.progress} />}
            <div contentEditable={false} className={clsx('qdr-inline-toolbar', 'qdr-image-uploader__inline-toolbar')}>
              <Icon
                className={clsx('qdr-inline-toolbar__icon', {
                  'qdr-inline-toolbar__icon--disabled': disabled,
                })}
                icon={Trash}
                width={24}
                height={24}
                onClick={() => {
                  if (!disabled) {
                    setImageUploaderItem(() => null);
                  }
                }}
              />
            </div>
            <img
              src={imageUploaderItem.url || imageUploaderItem.preview}
              className="qdr-image-uploader__image"
              style={{
                objectFit: ratio ? 'cover' : 'contain',
                aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1',
              }}
            />
          </div>
        </div>
      ) : (
        <div
          className={clsx('qdr-image-uploader', {
            'qdr-image-uploader--error': isError,
            'qdr-image-uploader--disabled': disabled,
          })}
          style={{ width, aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1' }}
          onClick={onUpload}
        >
          {isError ? (
            <>
              <Icon icon={Image} width={24} height={24} className="qdr-image-uploader__icon" />
              <span className="qdr-image-uploader__main-text">上傳錯誤</span>
            </>
          ) : (
            <>
              <Icon icon={Plus} width={24} height={24} className="qdr-image-uploader__icon" />
              <span className="qdr-image-uploader__main-text">上傳</span>
            </>
          )}
        </div>
      )}
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
