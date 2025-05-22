import {
  Editor,
  QuadratsElement,
  Transforms,
} from '@quadrats/core';
import {
  Accordion,
  AccordionElement,
} from './typings';
import { ACCORDION_TYPE } from './constants';

export interface CreateAccordionOptions {
  type?: string;
}

export function createAccordion(options: CreateAccordionOptions = {}): Accordion<Editor> {
  const { type = ACCORDION_TYPE } = options;

  const accordionElement: AccordionElement = {
    type, children: [{ text: '' }],
  };

  const insertAccordion: Accordion<Editor>['insertAccordion'] = (editor) => {
    Transforms.insertNodes(editor, [accordionElement], {
      at: editor.selection?.anchor,
    });
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