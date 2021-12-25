import {
  Descendant,
  Node,
  QuadratsElement,
  QuadratsText,
} from '@quadrats/core';
import { FootnoteData, FootnoteElement, FOOTNOTE_TYPE } from '@quadrats/common/footnote';

function deepSearchFootnoteFromNodes(nodes: Descendant[]): FootnoteElement[] {
  const result = nodes.flatMap((element) => {
    const curNode = Node.isNode(element)
      && (element as FootnoteElement).type === FOOTNOTE_TYPE ? (element as FootnoteElement) : null;
    const child = Node.isNodeList((element as QuadratsElement)?.children)
      ? deepSearchFootnoteFromNodes((element as QuadratsElement)?.children ?? []) : null;

    return curNode ?? child ?? [];
  });

  return result;
}

export function useFootnotesFromNodes(nodes: Descendant[]): FootnoteData[] {
  const filter = deepSearchFootnoteFromNodes(nodes);

  return filter.map((element) => ({
    wrapperText: (element?.children)?.map((childNode) => (childNode as QuadratsText).text as string).join(''),
    footnote: element.footnote,
    index: element.index,
  } as FootnoteData));
}

export default useFootnotesFromNodes;
