import React, { Dispatch, SetStateAction, useState, useMemo, useCallback } from 'react';
import {
  FileUploaderGetBody,
  FileUploaderGetHeaders,
  FileUploaderGetUrl,
  FileUploaderImplement,
  ImageAccept,
} from '@quadrats/common/file-uploader';
import { readFileAsBase64, upload } from '@quadrats/react/utils';
import { Trash } from '@quadrats/icons';
import clsx from 'clsx';
import { Plus, Image } from '@quadrats/icons';
import BaseField, { BaseFieldProps } from '../BaseField';
import Icon from '../Icon';
import { Hints } from '../Hint';
import Progress from '../Progress';

export type ImageUploaderItem = {
  file: File;
  progress: number;
  preview: string;
  url: string;
};

export interface ImageUploaderProps extends Omit<BaseFieldProps, 'children'> {
  getBody: FileUploaderGetBody;
  getHeaders?: FileUploaderGetHeaders;
  getUrl: FileUploaderGetUrl;
  uploader?: FileUploaderImplement;
  imageUploaderItem: ImageUploaderItem | null;
  setImageUploaderItem: Dispatch<SetStateAction<ImageUploaderItem | null>>;
  accept?: ImageAccept[];
  ratio?: [number, number];
  limitSize?: number;
  disabled?: boolean;
  onOverLimitSize?: VoidFunction;
  onErrorAccept?: VoidFunction;
}

// TODO: i18n
const ImageUploader = ({
  label,
  className,
  getBody,
  getHeaders,
  getUrl,
  uploader,
  imageUploaderItem,
  setImageUploaderItem,
  width = 140,
  accept = ['image/jpeg', 'image/jpg', 'image/png'],
  ratio,
  limitSize = 5,
  disabled = false,
  required,
  errorMessage,
  onOverLimitSize,
  onErrorAccept,
}: ImageUploaderProps) => {
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

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

  const onUpload = useCallback(
    async (file?: File) => {
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
            const url = await upload({
              file,
              getBody,
              getHeaders,
              getUrl,
              uploader,
              onProgress,
            });

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
    },
    [getBody, getHeaders, getUrl, limitSize, onOverLimitSize, onProgress, setImageUploaderItem, uploader],
  );

  const onSelectFile = useCallback(async () => {
    if (!disabled && !imageUploaderItem) {
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
    }
  }, [accept, disabled, imageUploaderItem]);

  const handleDrop = useCallback(
    async (event: React.DragEvent<HTMLDivElement>) => {
      if (event.dataTransfer?.types?.includes('Files') && !disabled && !imageUploaderItem) {
        event.preventDefault();
        setIsDragging(false);
        setIsError(false);

        const files = Array.from(event.dataTransfer.files);
        const targetFile = files[0];

        if (targetFile.size > limitSize * 1024 * 1024) {
          setIsError(true);
          onOverLimitSize?.();

          return;
        }

        if (!accept.find((a) => a === targetFile.type)) {
          setIsError(true);
          onErrorAccept?.();

          return;
        }

        await onUpload(targetFile);
      }
    },
    [accept, disabled, imageUploaderItem, limitSize, onErrorAccept, onOverLimitSize, onUpload],
  );

  const acceptText = useMemo(() => {
    if (accept.find((a) => a === 'image/jpeg' || a === 'image/jpg') && accept.find((a) => a === 'image/png')) {
      return 'JPG 或 PNG';
    } else if (accept.find((a) => a === 'image/png')) {
      return 'PNG';
    } else if (accept.find((a) => a === 'image/jpeg' || a === 'image/jpg')) {
      return 'JPG';
    }

    return '';
  }, [accept]);

  return (
    <BaseField className={className} label={label} required={required} width={width} errorMessage={errorMessage}>
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
              'qdr-image-uploader--dragging': isDragging,
              'qdr-image-uploader--error': isError,
              'qdr-image-uploader--disabled': disabled,
            })}
            style={isDragging ? undefined : { width, aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1' }}
            onClick={async () => {
              const file = await onSelectFile();

              await onUpload(file);
            }}
            onDragOver={(e) => {
              e.preventDefault();

              if (e.dataTransfer?.types?.includes('Files')) {
                setIsDragging(true);
                setIsError(false);
              }
            }}
            onDragLeave={() => {
              setIsDragging(false);
              setIsError(false);
            }}
            onDrop={handleDrop}
          >
            {isError ? (
              <>
                <Icon icon={Image} width={24} height={24} className="qdr-image-uploader__icon" />
                <span className="qdr-image-uploader__main-text">上傳錯誤</span>
              </>
            ) : (
              <>
                <Icon icon={Plus} width={24} height={24} className="qdr-image-uploader__icon" />
                {isDragging ? (
                  <div className="qdr-image-uploader__dragging-wrapper">
                    <span className="qdr-image-uploader__main-text">點擊或拖曳檔案到此上傳</span>
                    <span className="qdr-image-uploader__info-text">
                      {ratio
                        ? `僅能上傳 ${acceptText}；建議比例為 ${ratio[0]}:${ratio[1]} 且寬度至少達 2000px 以上；檔案大小不可超過 ${limitSize}MB`
                        : `僅能上傳 ${acceptText}；檔案大小不可超過 ${limitSize}MB`}
                    </span>
                  </div>
                ) : (
                  <span className="qdr-image-uploader__main-text">上傳</span>
                )}
              </>
            )}
          </div>
        )}
        <Hints
          style={{ width }}
          hints={[
            {
              text: `檔案格式：限 ${acceptText}。`,
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
    </BaseField>
  );
};

export default ImageUploader;
