import React from 'react';
import { Carousel, CarouselImages, CarouselCaption } from '@quadrats/react/carousel';
import { CarouselJsxSerializeElements } from './typings';

export const defaultRenderCarouselElements: CarouselJsxSerializeElements = {
  carousel: (props) => <Carousel {...props} />,
  carousel_images: (props) => <CarouselImages {...props} />,
  carousel_caption: (props) => <CarouselCaption {...props} />,
};
