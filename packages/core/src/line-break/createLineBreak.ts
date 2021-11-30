/* eslint-disable no-useless-return */
import {
  Element,
  normalizeVoidElementChildren,
  WithElementType,
} from '@quadrats/core';
import { LineBreak } from './typings';
import { LINE_BREAK_TYPE } from './constants';

export type CreateLineBreakOptions = Partial<WithElementType>;

export function createLineBreak({
  type = LINE_BREAK_TYPE,
}: CreateLineBreakOptions): LineBreak {
  return {
    type,
    with(editor) {
      const { isInline, normalizeNode } = editor;

      editor.isInline = (element) => element.type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && node.type === type) {
          /**
           * Set invalid level elements to default.
           */
          normalizeVoidElementChildren(editor, [node, path]);
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
