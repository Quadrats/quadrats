import {
  Editor,
  QuadratsElement,
  Transforms,
} from '@quadrats/core';
import {
  Accordion,
  AccordionElement,
} from './typings';
import { ACCORDION_TYPES } from './constants';

export interface CreateAccordionOptions {
  type?: string;
}

export function createAccordion(options: CreateAccordionOptions = {}): Accordion<Editor> {
  const { type = ACCORDION_TYPES.accordion } = options;

  const accordionElement: AccordionElement = {
    type,
    expanded: true,
    children: [
      { type: ACCORDION_TYPES['accordion-title'], children: [{ text: '折疊項目標題' }] },
      { type: ACCORDION_TYPES['accordion-content'], children: [{ text: '空白折疊列表，請在此輸入內容...' }] },
    ],
  };

  const insertAccordion: Accordion<Editor>['insertAccordion'] = (editor) => {
    Transforms.insertNodes(editor, accordionElement);
  };

  return {
    type,
    insertAccordion,
    with(editor) {
      const { isVoid } = editor;

      editor.isVoid = element => (element as QuadratsElement).type === type || isVoid(element);

      return editor;
    },
  };
}