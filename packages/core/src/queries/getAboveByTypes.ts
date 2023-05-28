import {
  Ancestor,
  Editor,
  EditorAboveOptions,
  NodeEntry,
} from 'slate';
import { QuadratsElement } from '../typings';

export type GetAboveByTypesOptions = EditorAboveOptions<Ancestor>;

/**
 * Get the element above a location by types.
 */
export function getAboveByTypes<T extends Ancestor>(
  editor: Editor,
  types: string[],
  options: GetAboveByTypesOptions = {},
): NodeEntry<T> | undefined {
  const { match } = options;

  return Editor.above<T>(editor, {
    ...options,
    match: (node, path) => types.includes((node as QuadratsElement).type as string) && (!match || match(node, path)),
  });
}
