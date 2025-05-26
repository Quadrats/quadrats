import React from 'react';
import { defaultRenderAccordionElements as defaultRenderReactAccordionElements } from '@quadrats/react/accordion';
import { AccordionJsxSerializeElements } from './typings';

export const defaultRenderAccordionElements: AccordionJsxSerializeElements = {
  accordion: defaultRenderReactAccordionElements.accordion,
  accordion_title: ({ children }) => <p className="qdr-accordion__title">{children}</p>,
  accordion_content: ({ children }) => <p className="qdr-accordion__content">{children}</p>,
};