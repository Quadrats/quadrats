import { Editor } from 'slate';
import { QuadratsElement } from '../typings';
import { getNodes, GetNodesOptions } from './getNodes';

export type GetNodesByTypesOptions = GetNodesOptions;

export function getNodesByTypes(editor: Editor, types: string[], options: GetNodesByTypesOptions = {}) {
  const { match } = options;
  return getNodes(editor, {
    ...options,
    match: (node, path) => types.includes((node as QuadratsElement).type as string) && (!match || match(node, path)),
  });
}
