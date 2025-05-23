import {
  Editor,
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
    expanded: true,
    children: [
      { type: types.accordion_title, children: [{ text: '折疊項目標題' }] },
      { type: types.accordion_content, children: [{ text: '空白折疊列表，請在此輸入內容...' }] },
    ],
  };

  const insertAccordion: Accordion<Editor>['insertAccordion'] = (editor) => {
    Transforms.insertNodes(editor, accordionElement);
  };

  return {
    types,
    insertAccordion,
    with(editor) {
      return editor;
    },
  };
}