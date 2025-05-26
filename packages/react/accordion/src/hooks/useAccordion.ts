import { useContext } from 'react';
import { AccordionContext } from '../contexts/AccordionContext';

export function useAccordion() {
  return useContext(AccordionContext);
}
