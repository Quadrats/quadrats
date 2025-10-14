import { getNodes, PARAGRAPH_TYPE, QuadratsElement, Transforms } from '@quadrats/core';
import { Paragraph, ParagraphElement } from './typings';

export function createParagraph(): Paragraph {
  const getParagraphNodes: Paragraph['getParagraphNodes'] = (editor, options = {}) =>
    getNodes(editor, {
      ...options,
      match: (node) => (node as ParagraphElement).type === PARAGRAPH_TYPE,
    });

  const isSelectionInParagraph: Paragraph['isSelectionInParagraph'] = (editor, options = {}) => {
    const [match] = getParagraphNodes(editor, options);

    return !!match;
  };

  const setParagraphNodes: Paragraph['setParagraphNodes'] = (editor) => {
    const paragraph: ParagraphElement = { type: PARAGRAPH_TYPE, children: [] };

    Transforms.setNodes(editor, paragraph as QuadratsElement);
  };

  return {
    type: PARAGRAPH_TYPE,
    getParagraphNodes,
    isSelectionInParagraph,
    setParagraphNodes,
    with(editor) {
      return editor;
    },
  };
}
