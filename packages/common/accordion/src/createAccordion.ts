import {
  Editor,
  isNodesTypeIn,
  Transforms,
  Element,
  Text,
  Node,
  QuadratsElement,
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
      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
          const type = (node as QuadratsElement).type;

          if (type === types.accordion) {
            if (!isNodesTypeIn(editor, [types.accordion_content], { at: path })) {
              Transforms.removeNodes(editor, { at: path });

              return;
            }
          } else if (type === types.accordion_title || type === types.accordion_content) {
            if (node.children.length !== 1 || !Text.isText(node.children[0])) {
              const mergedText = node.children.map(child => Node.string(child)).join('');
              const mergedElement: QuadratsElement = {
                type,
                children: [{ text: mergedText }],
              };

              Transforms.removeNodes(editor, { at: path });
              Transforms.insertNodes(editor, mergedElement, { at: path });
              Transforms.select(editor, Editor.end(editor, path));

              return;
            }
          }
        }
      };

      return editor;
    },
  };
}