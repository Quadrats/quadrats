import React from 'react';
import Carousel from './components/Carousel';
import CarouselImages from './components/CarouselImages';
import CarouselCaption from './components/CarouselCaption';
import CarouselPlaceholder from './components/CarouselPlaceholder';
import { CarouselRenderElements, RenderCarouselPlaceholderElement } from './typings';

export const defaultRenderCarouselElements: CarouselRenderElements = {
  carousel: (props) => <Carousel {...props} />,
  carousel_images: (props) => <CarouselImages {...props} />,
  carousel_caption: (props) => <CarouselCaption {...props} />,
};

export const defaultRenderCarouselPlaceholderElement: RenderCarouselPlaceholderElement = (props) => (
  <CarouselPlaceholder {...props} />
);
