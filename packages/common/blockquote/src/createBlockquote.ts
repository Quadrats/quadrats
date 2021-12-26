import {
  createParagraphElement,
  Editor,
  Element,
  isNodesTypeIn,
  normalizeOnlyInlineOrTextInChildren,
  QuadratsElement,
  toggleNodesType,
  Transforms,
  WithElementType,
} from '@quadrats/core';
import { Blockquote } from './typings';
import { BLOCKQUOTE_TYPE } from './constants';

export type CreateBlockquoteOptions = Partial<WithElementType>;

export function createBlockquote({ type = BLOCKQUOTE_TYPE }: CreateBlockquoteOptions = {}): Blockquote {
  return {
    type,
    isSelectionInBlockquote: editor => isNodesTypeIn(editor, [type]),
    toggleBlockquote: (editor) => {
      const actived = isNodesTypeIn(editor, [type]);

      toggleNodesType(editor, type);

      if (!actived) {
        if (editor.selection) {
          // Select to line end
          const originPoint = Editor.point(editor, editor.selection.focus);

          Transforms.move(editor, { unit: 'line', edge: 'end' });
          Transforms.collapse(editor, { edge: 'end' });

          // Only last block add paragraph automatically
          if (!Editor.next(editor)) {
            Transforms.insertNodes(editor, [createParagraphElement()]);
          }

          Transforms.select(editor, originPoint);
        }
      }
    },
    with(editor) {
      const { normalizeNode } = editor;

      editor.normalizeNode = (entry) => {
        const [node] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          if (normalizeOnlyInlineOrTextInChildren(editor, entry)) {
            return;
          }
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
