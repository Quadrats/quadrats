import { Ancestor, Node } from 'slate';
import { QuadratsElement } from '../typings';

export function isAncestorEmpty(node: Ancestor) {
  return (
    ((node as QuadratsElement).children ?? []).length === 1 &&
    (node as QuadratsElement).type === 'p' &&
    [...Node.texts(node)].length === 1 &&
    Node.string(node) === ''
  );
}
