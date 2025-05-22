import {
  Transforms,
} from '@quadrats/core';
import {
  Accordion,
} from './typings';
import { ACCORDION_TYPE } from './constants';

export interface CreateAccordionOptions {
  type?: string;
}

export function createAccordion(options: CreateAccordionOptions): Accordion {
  const { type = ACCORDION_TYPE } = options;

  const insertAccordion: Accordion['insertAccordion'] = (editor) => {
    Transforms.insertNodes(editor, { type, children: [{ text: '' }] });
  };

  return {
    type,
    insertAccordion,
    with(editor) {
      return editor;
    },
  };
}