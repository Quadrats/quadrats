import React from 'react';
import { CarouselWithoutToolbar, CarouselImages, CarouselCaption } from '@quadrats/react/carousel';
import { CarouselJsxSerializeElements } from './typings';

export const defaultRenderCarouselElements: CarouselJsxSerializeElements = {
  carousel: (props) => <CarouselWithoutToolbar {...props} />,
  carousel_images: (props) => <CarouselImages {...props} />,
  carousel_caption: (props) => <CarouselCaption {...props} />,
};
