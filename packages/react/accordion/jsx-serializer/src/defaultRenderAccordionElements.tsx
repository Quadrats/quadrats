import React from 'react';
import {
  defaultRenderAccordionElements as defaultRenderReactAccordionElements,
  useAccordion,
} from '@quadrats/react/accordion';
import { AccordionJsxSerializeElements } from './typings';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

const AccordionContentJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  const { expanded } = useAccordion();

  if (!expanded) return null;

  return <p className="qdr-accordion__content">{children}</p>;
};

export const defaultRenderAccordionElements: AccordionJsxSerializeElements = {
  accordion: defaultRenderReactAccordionElements.accordion,
  accordion_title: ({ children }) => <p className="qdr-accordion__title">{children}</p>,
  accordion_content: props => <AccordionContentJsxSerializeElement {...props} />,
};