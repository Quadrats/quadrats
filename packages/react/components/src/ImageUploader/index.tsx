import React from 'react';
import clsx from 'clsx';
import { Plus } from '@quadrats/icons';
import Icon from '../Icon';
import { Hints } from '../Hint';

export interface ImageUploaderProps {
  width?: number;
  ratio?: [number, number];
  limitSize?: number;
  disabled?: boolean;
}

const ImageUploader = ({ width = 140, ratio, limitSize = 5, disabled = false }: ImageUploaderProps) => {
  return (
    <div className="qdr-image-uploader__wrapper">
      <div
        className={clsx('qdr-image-uploader', {
          'qdr-image-uploader--disabled': disabled,
        })}
        style={{ width, aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '1 / 1' }}
      >
        <Icon icon={Plus} width={24} height={24} className="qdr-image-uploader__icon" />
        <span className="qdr-image-uploader__main-text">上傳</span>
      </div>
      <Hints
        style={{ width }}
        hints={[
          {
            text: '檔案格式：限 JPG 或 PNG。',
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
