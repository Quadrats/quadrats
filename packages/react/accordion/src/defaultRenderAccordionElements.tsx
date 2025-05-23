import React from 'react';
import Accordion from './components/Accordion';
import AccordionTitle from './components/AccordionTitle';
import AccordionContent from './components/AccordionContent';
import { AccordionRenderElements } from './typings';

export const defaultRenderAccordionElements: AccordionRenderElements = {
  accordion: props => <Accordion {...props} />,
  accordion_title: props => <AccordionTitle {...props} />,
  accordion_content: props => <AccordionContent {...props} />,
};
