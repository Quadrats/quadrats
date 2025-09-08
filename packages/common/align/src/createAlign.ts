import { Editor, Transforms, Element, PARAGRAPH_TYPE } from '@quadrats/core';
import { ALIGN_TYPE } from './constants';
import { AlignValue } from './typings';
import { ParagraphElement } from '@quadrats/common/paragraph';
import { HEADING_TYPE, HeadingElement } from '@quadrats/common/heading';
import { QuadratsReactEditor } from '@quadrats/react';

export interface Align<E extends Editor = QuadratsReactEditor> {
  type: string;
  isAlignActive: (editor: E, value: AlignValue) => boolean;
  setAlign: (editor: E, value: AlignValue) => void;
  removeAlign: (editor: E) => void;
}

const ALIGNABLE_TYPES = [PARAGRAPH_TYPE, HEADING_TYPE];

export function createAlign(): Align {
  const type = ALIGN_TYPE;

  return {
    type,
    isAlignActive: (editor, value) => {
      const { selection } = editor;

      if (!selection) return false;

      const [match] = Editor.nodes(editor, {
        match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
      });

      if (!match) return false;

      const [node] = match;

      return (node as ParagraphElement | HeadingElement)[type] === value;
    },
    setAlign: (editor, value) => {
      Transforms.setNodes(editor, { [type]: value } as ParagraphElement | HeadingElement, {
        match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
      });
    },
    removeAlign: (editor) => {
      Transforms.unsetNodes(editor, [type], {
        match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
      });
    },
  };
}
