import { Editor, Node, EditorNodesOptions } from 'slate';
import { unhangRange, UnhangRangeOptions } from '../transforms/unhangRange';

export type GetNodesOptions = EditorNodesOptions<Node> & UnhangRangeOptions;

export function getNodes<T extends Node>(editor: Editor, options: GetNodesOptions = {}) {
  unhangRange(editor, options);

  return Editor.nodes<T>(editor, options);
}
