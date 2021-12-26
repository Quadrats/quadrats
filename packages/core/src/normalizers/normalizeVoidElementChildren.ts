import {
  Editor,
  NodeEntry,
  Text,
  Transforms,
} from 'slate';
import { QuadratsText, QuadratsElement } from '../typings';

export function normalizeVoidElementChildren(editor: Editor, entry: NodeEntry<QuadratsElement>): boolean {
  const [element, path] = entry;

  /**
   * Only accept single empty text inside void element.
   */
  if (!((element as QuadratsElement).children?.length === 1
    && Text.isText((element as QuadratsElement)?.children?.[0])
    && ((element as QuadratsElement).children?.[0] as QuadratsText | undefined)?.text === '')) {
    Editor.withoutNormalizing(editor, () => {
      Transforms.removeNodes(editor, { at: path });
      Transforms.insertNodes(editor, { ...element, children: [{ text: '' }] }, { at: path });
    });

    return true;
  }

  return false;
}
