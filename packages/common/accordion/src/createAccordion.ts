import {
  Editor,
  isNodesTypeIn,
  Transforms,
} from '@quadrats/core';
import {
  Accordion,
  AccordionElement,
  AccordionTypes,
} from './typings';
import { ACCORDION_TYPES } from './constants';

export interface CreateAccordionOptions {
  types?: Partial<AccordionTypes>;
}

export function createAccordion(options: CreateAccordionOptions = {}): Accordion<Editor> {
  const { types: typesOptions } = options;

  const types: AccordionTypes = { ...ACCORDION_TYPES, ...typesOptions };

  const accordionElement: AccordionElement = {
    type: types.accordion,
    children: [
      { type: types.accordion_title, children: [{ text: '' }] },
      { type: types.accordion_content, children: [{ text: '' }] },
    ],
  };

  const isSelectionInAccordionTitle: Accordion<Editor>['isSelectionInAccordionTitle']
    = editor => isNodesTypeIn(editor, [types.accordion_title]);

  const isSelectionInAccordionContent: Accordion<Editor>['isSelectionInAccordionContent']
    = editor => isNodesTypeIn(editor, [types.accordion_content]);

  const insertAccordion: Accordion<Editor>['insertAccordion'] = (editor) => {
    Transforms.insertNodes(editor, accordionElement);
  };

  return {
    types,
    isSelectionInAccordionTitle,
    isSelectionInAccordionContent,
    insertAccordion,
    with(editor) {
      return editor;
    },
  };
}