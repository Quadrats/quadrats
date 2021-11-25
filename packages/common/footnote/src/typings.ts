import {
  Editor,
  Range,
  Element,
  WithElementType,
  UnwrapNodeByTypesOptions,
  TransformsWrapNodesOptions,
  Withable,
  NodeEntry,
  Node,
} from '@quadrats/core';

export interface FootnoteElement extends Element, WithElementType {
  footnote: string;
  index?: number;
}

export interface FootnoteUpdateFootnoteIndexOptions {
  startAt?: number;
}

export type FootnoteUnwrapFootnoteOptions = UnwrapNodeByTypesOptions;

export interface FootnoteWrapFootnoteOptions extends Omit<TransformsWrapNodesOptions, 'split'> {
  index?: number;
}

export interface FootnoteUpsertFootnoteOptions {
  at?: Range;
}

export interface Footnote extends WithElementType, Withable {
  getAllFootnotes(editor: Editor): NodeEntry<Node>[];
  getFootnoteText(editor: Editor): string;
  isSelectionInFootnote(editor: Editor): boolean;
  unwrapFootnote(editor: Editor, options?: FootnoteUnwrapFootnoteOptions): void;
  updateFootnoteIndex(editor: Editor, options?: FootnoteUpdateFootnoteIndexOptions): void;
  upsertFootnoteAndUpdateIndex(editor: Editor, footnote: string, options?: FootnoteUpsertFootnoteOptions): void;
  wrapFootnote(editor: Editor, footnote: string, options?: FootnoteWrapFootnoteOptions): void;
}
