import { Editor, Transforms, Element, PARAGRAPH_TYPE } from '@quadrats/core';
import { ALIGN_TYPE } from './constants';
import { AlignValue } from './typings';
import { ParagraphElement } from '@quadrats/common/paragraph';
import { HEADING_TYPE, HeadingElement } from '@quadrats/common/heading';

export interface Align<E extends Editor = Editor> {
  type: string;
  isAlignActive: (editor: E, value: AlignValue) => boolean;
  setAlign: (editor: E, value: AlignValue) => void;
  removeAlign: (editor: E) => void;
}

const ALIGNABLE_TYPES = [PARAGRAPH_TYPE, HEADING_TYPE];

export function createAlign<E extends Editor = Editor>(): Align<E> {
  const type = ALIGN_TYPE;

  const isAlignActive = (editor: E, value: AlignValue): boolean => {
    const { selection } = editor;

    if (!selection) return false;

    const [match] = Editor.nodes(editor, {
      match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
    });

    if (!match) return false;

    const [node] = match;

    return (node as ParagraphElement | HeadingElement)[type] === value;
  };

  const setAlign = (editor: E, value: AlignValue): void => {
    Transforms.setNodes(editor, { [type]: value } as ParagraphElement | HeadingElement, {
      match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
    });
  };

  const removeAlign = (editor: E): void => {
    Transforms.unsetNodes(editor, [type], {
      match: (n) => !!(Element.isElement(n) && n.type && ALIGNABLE_TYPES.includes(n.type)),
    });
  };

  return {
    type,
    isAlignActive,
    setAlign,
    removeAlign,
  };
}
