import {
  Node,
} from '@quadrats/core';
import { FootnoteData, FootnoteElement, FOOTNOTE_TYPE } from '@quadrats/common/footnote';

function deepSearchFootnoteFromNodes(nodes: Node[]): FootnoteElement[] {
  const result = nodes.flatMap((element) => {
    const curNode = Node.isNode(element)
      && (element as FootnoteElement).type === FOOTNOTE_TYPE ? (element as FootnoteElement) : null;
    const child = Node.isNodeList(element?.children) ? deepSearchFootnoteFromNodes(element?.children) : null;

    return curNode ?? child ?? [];
  });

  return result;
}

export function useFootnotesFromNodes(nodes: Node[]): FootnoteData[] {
  const filter = deepSearchFootnoteFromNodes(nodes);

  return filter.map((element) => ({
    wrapperText: (element?.children)?.map((childNode) => childNode.text as string).join(''),
    footnote: element.footnote,
    index: element.index,
  } as FootnoteData));
}

export default useFootnotesFromNodes;
