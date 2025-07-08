import React, { useState } from 'react';
import { Input } from '@quadrats/react/components';

interface CarouselItemProps {
  url: string;
  ratio?: [number, number];
}

const CarouselItem = ({ url, ratio }: CarouselItemProps) => {
  const [value, setValue] = useState('');

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
        <Input value={value} onChange={setValue} placeholder="圖片說明或替代文字..." />
      </div>
    </div>
  );
};

export default CarouselItem;
