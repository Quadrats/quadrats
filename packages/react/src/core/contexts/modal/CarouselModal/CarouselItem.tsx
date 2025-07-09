import React from 'react';
import { Input } from '@quadrats/react/components';

interface CarouselItemProps {
  url: string;
  caption: string;
  onChange: (value: string) => void;
  ratio?: [number, number];
}

const CarouselItem = ({ url, caption, onChange, ratio }: CarouselItemProps) => {
  return (
    <div className="qdr-carousel-modal__item">
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
    </div>
  );
};

export default CarouselItem;
