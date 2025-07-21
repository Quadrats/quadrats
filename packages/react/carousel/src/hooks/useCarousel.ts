import { useContext } from 'react';
import { CarouselContext } from '../contexts/CarouselContext';

export function useCarousel() {
  return useContext(CarouselContext);
}
