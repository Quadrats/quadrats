import { Editor } from 'slate';
import { LINE_BREAK_TYPE } from '../line-break';
import { QuadratsElement } from '../typings';

export function insertSoftBreak(editor: Editor) {
  const softBreakElement: QuadratsElement = { type: LINE_BREAK_TYPE, children: [{ text: '\n' }] };

  editor.insertNode(softBreakElement);
}
