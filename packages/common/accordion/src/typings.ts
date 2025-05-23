import {
  Editor,
  QuadratsElement,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export type AccordionTypeKey = 'accordion';
export type AccordionTitleTypeKey = 'accordion-title';
export type AccordionContentTypeKey = 'accordion-content';

export type AccordionTypes = Record<AccordionTypeKey | AccordionTitleTypeKey | AccordionContentTypeKey, string>;

export interface AccordionElement extends QuadratsElement, WithElementType {
  expanded: boolean;
  children: {
    type: string;
    children: [Text];
  }[];
}

export interface Accordion<T extends Editor = Editor> extends WithElementType, Withable {
  insertAccordion(editor: T): void;
}
