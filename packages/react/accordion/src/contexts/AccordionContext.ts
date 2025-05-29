import { createContext } from 'react';
import { AccordionContextType } from '../typings';

export const AccordionContext = createContext<AccordionContextType>({ expanded: true });
