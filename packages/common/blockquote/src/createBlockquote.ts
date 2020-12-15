import {
  Element,
  isNodesTypeIn,
  normalizeOnlyInlineOrTextInChildren,
  toggleNodesType,
  WithElementType,
} from '@quadrats/core';
import { Blockquote } from './typings';
import { BLOCKQUOTE_TYPE } from './constants';

export type CreateBlockquoteOptions = Partial<WithElementType>;

export function createBlockquote({ type = BLOCKQUOTE_TYPE }: CreateBlockquoteOptions = {}): Blockquote {
  return {
    type,
    isSelectionInBlockquote: (editor) => isNodesTypeIn(editor, [type]),
    toggleBlockquote: (editor) => toggleNodesType(editor, type),
    with(editor) {
      const { normalizeNode } = editor;

      editor.normalizeNode = (entry) => {
        const [node] = entry;

        if (Element.isElement(node) && node.type === type) {
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
