import {
  Editor,
  Node,
  NodeEntry,
  Text,
  Transforms,
} from 'slate';
import { QuadratsElement } from '../typings';

export function normalizeOnlyInlineOrTextInChildren(editor: Editor, entry: NodeEntry<Node>): boolean {
  const [, path] = entry;

  for (const [child, childPath] of Node.children(editor, path)) {
    if (!(Editor.isInline(editor, child as QuadratsElement) || Text.isText(child))) {
      if (Editor.isVoid(editor, child)) {
        Transforms.removeNodes(editor, { at: childPath });
      } else {
        Transforms.unwrapNodes(editor, { at: childPath });
      }

      return true;
    }
  }

  return false;
}
