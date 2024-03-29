import {
  Editor,
  getNodes,
  QuadratsElement,
  QuadratsText,
} from '@quadrats/core';
import { FootnoteData, FootnoteElement, FOOTNOTE_TYPE } from '@quadrats/common/footnote';

export function useFootnotes(editor: Editor): FootnoteData[] {
  const footnoteNodes = Array.from(getNodes(editor, {
    at: [],
    match: node => (node as QuadratsElement).type === FOOTNOTE_TYPE,
  }));

  const footnotes: FootnoteData[] = footnoteNodes.map((node) => {
    const nodeData = node?.[0] as FootnoteElement;

    return {
      wrapperText: (nodeData?.children)?.map(childNode => (childNode as QuadratsText).text as string).join('') ?? '',
      footnote: nodeData?.footnote,
      index: nodeData?.index as number,
    };
  });

  return footnotes;
}

export default useFootnotes;
