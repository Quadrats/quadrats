import { createContext } from 'react';
import { CarouselContextType } from '../typings';

export const CarouselContext = createContext<CarouselContextType>({ activeIndex: 0, setActiveIndex: () => {} });
