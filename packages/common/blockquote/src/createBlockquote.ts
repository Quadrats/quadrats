import {
  Editor,
  isNodesTypeIn,
  WithElementType,
  wrapNodesWithUnhangRange,
  unwrapNodesByTypes,
} from '@quadrats/core';
import { Blockquote, BlockquoteElement } from './typings';
import { BLOCKQUOTE_TYPE } from './constants';

export type CreateBlockquoteOptions = Partial<WithElementType>;

export function createBlockquote({ type = BLOCKQUOTE_TYPE }: CreateBlockquoteOptions = {}): Blockquote {
  const unwrapBlockquote: Blockquote['unwrapBlockquote'] = (editor) => {
    unwrapNodesByTypes(editor, [type]);
  };

  const wrapBlockquote: Blockquote['wrapBlockquote'] = (editor: Editor) => {
    const element: BlockquoteElement = {
      type,
      children: [],
    };

    wrapNodesWithUnhangRange(editor, element, { split: true });
  };

  const isSelectionInBlockquote: Blockquote['isSelectionInBlockquote'] = editor => (
    isNodesTypeIn(editor, [type], { mode: 'highest' }));

  return {
    type,
    unwrapBlockquote,
    wrapBlockquote,
    isSelectionInBlockquote,

    toggleBlockquote: (editor) => {
      const actived = isSelectionInBlockquote(editor);

      if (editor.selection) {
        if (actived) {
          unwrapBlockquote(editor);
        } else {
          wrapBlockquote(editor);
        }
      }
    },
    with(editor) {
      return editor;
    },
  };
}
