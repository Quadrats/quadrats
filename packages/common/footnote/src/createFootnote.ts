/* eslint-disable max-len */
import {
  Editor,
  getNodes,
  isNodesTypeIn,
  Transforms,
  unwrapNodesByTypes,
  WithElementType,
  wrapNodesWithUnhangRange,
} from '@quadrats/core';
import { Footnote, FootnoteElement } from './typings';
import { FOOTNOTE_TYPE } from './constants';

export interface CreateFootnoteOptions extends Partial<WithElementType> {
  /**
   * The types of void elements can be wrapped by footnote.
   * Let footnote be block element if wrap some wrappable blocks.
   */
  wrappableVoidTypes?: string[];
}

export function createFootnote({
  type = FOOTNOTE_TYPE,
  wrappableVoidTypes,
}: CreateFootnoteOptions = {}): Footnote {
  const isSelectionInFootnote: Footnote['isSelectionInFootnote'] = (editor) => isNodesTypeIn(editor, [type]);

  // test
  const getFootnotes: Footnote['getFootnotes'] = (editor) => {
    const resultNodes = getNodes(editor, {
      at: [],
      match: (node) => node.type === FOOTNOTE_TYPE,
    });

    return Array.from(resultNodes);
  };

  const updateFootnoteIndex: Footnote['updateFootnoteIndex'] = (editor, options = { startAt: 1 }) => {
    let footnoteCount: number = options?.startAt ?? 1;

    for (const [, path] of getNodes(editor, { at: [], match: (node) => node.type === FOOTNOTE_TYPE })) {
      Transforms.setNodes(editor, { index: footnoteCount }, { at: path });
      footnoteCount += 1;
    }
  };

  const unwrapFootnote: Footnote['unwrapFootnote'] = (editor, options = {}) => {
    unwrapNodesByTypes(editor, [type], options);
  };

  const wrapFootnote: Footnote['wrapFootnote'] = (editor, footnoteText, options = {}) => {
    const footnote: FootnoteElement = {
      type,
      footnote: footnoteText,
      index: options?.index ?? 0,
      children: [],
    };

    wrapNodesWithUnhangRange(editor, footnote, { ...options, split: true });
  };
  const upsertFootnoteAndUpdateIndex: Footnote['upsertFootnoteAndUpdateIndex'] = (editor, footnoteText, options = {}) => {
    const { at = editor.selection } = options;

    if (!at) {
      return;
    }

    unwrapFootnote(editor, { at });
    if (footnoteText !== '') {
      wrapFootnote(editor, footnoteText, { at });
    }

    updateFootnoteIndex(editor);
  };

  return {
    type,
    getFootnotes,
    isSelectionInFootnote,
    updateFootnoteIndex,
    unwrapFootnote,
    wrapFootnote,
    upsertFootnoteAndUpdateIndex,
    with(editor) {
      const { isInline } = editor;

      editor.isInline = (element) => {
        if (element.type !== type) {
          return isInline(element);
        }

        if (!wrappableVoidTypes) {
          return true;
        }

        return !element.children.some(
          (child) => Editor.isBlock(editor, child)
          && Editor.isVoid(editor, child)
          && wrappableVoidTypes.includes(child.type as string),
        );
      };

      return editor;
    },
  };
}
