import {
  Editor,
  Range,
  QuadratsElement,
  WithElementType,
  UnwrapNodeByTypesOptions,
  TransformsWrapNodesOptions,
  Withable,
} from '@quadrats/core';

export interface FootnoteData {
  footnote: string,
  index: number,
  wrapperText: string,
}

export interface FootnoteElement extends QuadratsElement, WithElementType {
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

export interface Footnote<T extends Editor = Editor> extends WithElementType, Withable {
  getFootnoteText(editor: T): string;
  isSelectionInFootnote(editor: T): boolean;
  unwrapFootnote(editor: T, options?: FootnoteUnwrapFootnoteOptions): void;
  updateFootnoteIndex(editor: T, options?: FootnoteUpdateFootnoteIndexOptions): void;
  upsertFootnoteAndUpdateIndex(editor: T, footnote: string, options?: FootnoteUpsertFootnoteOptions): void;
  wrapFootnote(editor: T, footnote: string, options?: FootnoteWrapFootnoteOptions): void;
}
