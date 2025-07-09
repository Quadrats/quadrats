import React from 'react';
import clsx from 'clsx';
import { useDrag, useDrop } from 'react-dnd';
import { Input } from '@quadrats/react/components';

interface CarouselItemProps {
  url: string;
  caption: string;
  index: number;
  onChange: (value: string) => void;
  onRemove: VoidFunction;
  swap: (from: number, to: number) => void;
  ratio?: [number, number];
}

const CarouselItem = ({ url, caption, index, onChange, swap, ratio }: CarouselItemProps) => {
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

  return drop(
    drag(
      dragPreview(
        <div
          className={clsx('qdr-carousel-modal__item', {
            'qdr-carousel-modal__item--isDragging': isDragging,
            'qdr-carousel-modal__item--isOver': isOver,
          })}
        >
          <img
            src={url}
            className="qdr-carousel-modal__image"
            style={{
              objectFit: ratio ? 'cover' : 'contain',
              aspectRatio: ratio ? `${ratio[0]} / ${ratio[1]}` : '3 /2',
            }}
          />
          <div className="qdr-carousel-modal__input-wrapper">
            <Input value={caption} onChange={onChange} placeholder="圖片說明或替代文字..." />
          </div>
        </div>,
      ),
    ),
  );
};

export default CarouselItem;
