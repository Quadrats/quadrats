import { Editor, isNodesTypeIn, WithElementType, wrapNodesWithUnhangRange, unwrapNodesByTypes } from '@quadrats/core';
import { Blockquote, BlockquoteElement } from './typings';
import { BLOCKQUOTE_TYPE } from './constants';
import { TABLE_CELL_TYPE } from '@quadrats/common/table';

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

  const isSelectionInBlockquote: Blockquote['isSelectionInBlockquote'] = (editor) =>
    isNodesTypeIn(editor, [type], { mode: 'highest' });

  return {
    type,
    unwrapBlockquote,
    wrapBlockquote,
    isSelectionInBlockquote,

    toggleBlockquote: (editor) => {
      if (!editor.selection) {
        return;
      }

      // 檢查是否在不合法範圍中，如果是則不執行 toggle
      try {
        const invalidEntry = Editor.above(editor, {
          at: editor.selection,
          match: (n) => {
            const element = n as any;

            return element.type === TABLE_CELL_TYPE;
          },
        });

        if (invalidEntry) return;
      } catch (error) {
        return;
      }

      const active = isSelectionInBlockquote(editor);

      if (active) {
        unwrapBlockquote(editor);
      } else {
        wrapBlockquote(editor);
      }
    },
    with(editor) {
      return editor;
    },
  };
}
