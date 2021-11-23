import { Editor } from 'slate';

export function marksGroupBy(
  editor: Editor,
  groupBy: (mark: string) => boolean,
) {
  const marks = Editor.marks(editor) || {};

  return Object.keys(marks).filter((m) => groupBy(m));
}
