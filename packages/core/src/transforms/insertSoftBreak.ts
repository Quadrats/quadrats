import { Editor, Transforms } from 'slate';
import { LINE_BREAK_TYPE } from '../line-break';

export function insertSoftBreak(editor: Editor) {
  let originPath;

  if (editor.selection) {
    originPath = editor.selection.focus.path;
  }

  editor.insertNode({ type: LINE_BREAK_TYPE, children: [{ text: '\n' }] });

  if (originPath) {
    Transforms.select(editor, {
      anchor: {
        offset: 0,
        path: [
          ...originPath.slice(0, -1),
          originPath[originPath.length - 1] + 2,
        ],
      },
      focus: {
        offset: 0,
        path: [
          ...originPath.slice(0, -1),
          originPath[originPath.length - 1] + 2,
        ],
      },
    });
  }
}
