import { Editor, Transforms } from 'slate';
import { QuadratsElement } from '../typings';
import { TransformsWrapNodesOptions } from '../adapter/slate';

export type UnwrapNodeByTypesOptions = TransformsWrapNodesOptions;

export function unwrapNodesByTypes(editor: Editor, types: string[], options: UnwrapNodeByTypesOptions = {}) {
  const { match } = options;
  Transforms.unwrapNodes(editor, {
    ...options,
    match: (node, path) => types.includes((node as QuadratsElement).type as string) && (!match || match(node, path)),
  });
}
