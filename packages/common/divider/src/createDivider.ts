import {
  createParagraphElement,
  Element,
  normalizeVoidElementChildren,
  QuadratsElement,
  Transforms,
  WithElementType,
} from '@quadrats/core';
import { Divider } from './typings';
import { DIVIDER_TYPE } from './constants';

export type CreateDividerOptions = Partial<WithElementType>;

export function createDivider(options: CreateDividerOptions = {}): Divider {
  const { type = DIVIDER_TYPE } = options;
  const createDividerElement: Divider['createDividerElement'] = () => ({ type, children: [{ text: '' }] });
  const insertDivider: Divider['insertDivider'] = (editor) => {
    Transforms.insertNodes(editor, [createDividerElement(), createParagraphElement()]);
    Transforms.move(editor);
  };

  return {
    type,
    createDividerElement,
    insertDivider,
    with(editor) {
      const { isVoid, normalizeNode } = editor;

      editor.isVoid = element => (element as QuadratsElement).type === type || isVoid(element);
      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        /**
         * Only accept single empty text inside void element.
         */
        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          if (normalizeVoidElementChildren(editor, [node as QuadratsElement, path])) {
            return;
          }
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
