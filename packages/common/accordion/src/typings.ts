import {
  Editor,
  QuadratsElement,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export type AccordionTypeKey = 'accordion';
export type AccordionTitleTypeKey = 'accordion_title';
export type AccordionContentTypeKey = 'accordion_content';

export type AccordionTypes = Record<AccordionTypeKey | AccordionTitleTypeKey | AccordionContentTypeKey, string>;

export interface AccordionElement extends QuadratsElement, WithElementType {
  children: {
    type: string;
    children: [Text];
  }[];
}

export interface Accordion<T extends Editor = Editor> extends Withable {
  types: AccordionTypes;
  createAccordionElement(): AccordionElement;
  isSelectionInAccordionTitle(editor: T): boolean;
  isSelectionInAccordionContent(editor: T): boolean;
  insertAccordion(editor: T): void;
}
