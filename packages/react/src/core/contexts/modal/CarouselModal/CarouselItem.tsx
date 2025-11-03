import React from 'react';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';
import { Input, Icon, Progress } from '@quadrats/react/components';
import { Trash, Image } from '@quadrats/icons';

interface CarouselItemProps {
  url: string;
  preview: string;
  progress: number;
  caption: string;
  index: number;
  onChange: (value: string) => void;
  onRemove: VoidFunction;
  swap: (from: number, to: number) => void;
  ratio?: [number, number];
  isError?: boolean;
}

const CarouselItem = ({
  url,
  preview,
  progress,
  caption,
  index,
  onChange,
  onRemove,
  swap,
  ratio,
  isError,
}: CarouselItemProps) => {
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: 'CarouselItem',
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: { index },
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'CarouselItem',
    collect: (monitor) => ({
      isOver: monitor.isOver({ shallow: true }),
    }),
    drop: (item: { index: number }) => {
      if (item.index !== index) {
        swap(item.index, index);
      }
    },
  }));

  // TODO: i18n
  return drop(
    drag(
      dragPreview(
        <div
          className={clsx('qdr-carousel-modal__item', {
            'qdr-carousel-modal__item--isDragging': isDragging,
            'qdr-carousel-modal__item--isOver': isOver,
          })}
        >
          {progress !== 100 && <Progress percentage={progress} />}
          <div contentEditable={false} className={clsx('qdr-inline-toolbar', 'qdr-carousel-modal__inline-toolbar')}>
            <Icon className="qdr-inline-toolbar__icon" icon={Trash} width={24} height={24} onClick={onRemove} />
          </div>
          <div className="qdr-carousel-modal__image-wrapper">
            {isError ? (
              <div
                className="qdr-carousel-modal__error-wrapper"
                style={{
                  aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '3 /2',
                }}
              >
                <Icon className="qdr-carousel-modal__error-icon" icon={Image} width={48} height={48} />
                <p className="qdr-carousel-modal__error-text">上傳錯誤</p>
              </div>
            ) : (
              <img
                src={url || preview}
                className="qdr-carousel-modal__image"
                style={{
                  objectFit: ratio ? 'cover' : 'contain',
                  aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '3 /2',
                }}
              />
            )}
          </div>
          <div className="qdr-carousel-modal__input-wrapper">
            <Input value={caption} onChange={onChange} placeholder="圖片說明或替代文字..." />
          </div>
        </div>,
      ),
    ),
  );
};

export default CarouselItem;
