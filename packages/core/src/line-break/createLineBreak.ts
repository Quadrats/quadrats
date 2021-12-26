/* eslint-disable no-useless-return */
import { Element } from 'slate';
import { LineBreak } from './typings';
import { LINE_BREAK_TYPE } from './constants';
import { WithElementType } from '../adapter/slate';
import { normalizeVoidElementChildren } from '../normalizers/normalizeVoidElementChildren';
import { QuadratsElement } from '../typings';

export type CreateLineBreakOptions = Partial<WithElementType>;

export function createLineBreak({
  type = LINE_BREAK_TYPE,
}: CreateLineBreakOptions): LineBreak {
  return {
    type,
    with(editor) {
      const { isInline, normalizeNode } = editor;

      editor.isInline = element => (element as QuadratsElement).type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          /**
           * Set invalid level elements to default.
           */
          normalizeVoidElementChildren(editor, [node as QuadratsElement, path]);
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
