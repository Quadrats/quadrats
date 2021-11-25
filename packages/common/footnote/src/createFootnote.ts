/* eslint-disable max-len */
import {
  getNodes,
  isNodesTypeIn,
  Transforms,
  unwrapNodesByTypes,
  WithElementType,
  wrapNodesWithUnhangRange,
} from '@quadrats/core';
import { Footnote, FootnoteElement } from './typings';
import { FOOTNOTE_TYPE } from './constants';

export type CreateFootnoteOptions = Partial<WithElementType>;

export function createFootnote({
  type = FOOTNOTE_TYPE,
}: CreateFootnoteOptions = {}): Footnote {
  const isSelectionInFootnote: Footnote['isSelectionInFootnote'] = (editor) => isNodesTypeIn(editor, [type]);

  const getAllFootnotes: Footnote['getAllFootnotes'] = (editor) => {
    const resultNodes = getNodes(editor, {
      at: [],
      match: (node) => node.type === FOOTNOTE_TYPE,
    });

    return Array.from(resultNodes);
  };

  const getFootnoteText: Footnote['getFootnoteText'] = (editor) => {
    const at = editor.selection;

    if (!at) {
      return '';
    }
    const nodes = getNodes(editor, { at, match: (node) => node.type === type });

    return Array.from(nodes)?.[0]?.[0]?.footnote as string;
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

    if (footnoteText !== '') {
      if (isSelectionInFootnote(editor)) {
        Transforms.setNodes(editor, { footnote: footnoteText }, { at, match: (node) => node.type === type });
      } else {
        wrapFootnote(editor, footnoteText, options);
      }
    } else {
      unwrapFootnote(editor, { at });
    }

    updateFootnoteIndex(editor);
  };

  return {
    type,
    getAllFootnotes,
    getFootnoteText,
    isSelectionInFootnote,
    updateFootnoteIndex,
    unwrapFootnote,
    wrapFootnote,
    upsertFootnoteAndUpdateIndex,
    with(editor) {
      const { isInline } = editor;

      editor.isInline = (element) => element.type === type || isInline(element);

      return editor;
    },
  };
}
