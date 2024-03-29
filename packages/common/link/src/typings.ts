import {
  Editor,
  Location,
  Range,
  WithElementType,
  TransformsInsertNodesOptions,
  UnwrapNodeByTypesOptions,
  TransformsWrapNodesOptions,
  Withable,
  QuadratsElement,
} from '@quadrats/core';

export interface LinkElement extends QuadratsElement, WithElementType {
  url: string;
}

export interface LinkInsertLinkOptions extends TransformsInsertNodesOptions {
  text?: string;
}

export type LinkUnwrapLinkOptions = UnwrapNodeByTypesOptions;

export type LinkWrapLinkOptions = Omit<TransformsWrapNodesOptions, 'split'>;

export interface LinkUpsertLinkOptions {
  at?: Range;
}

export interface Link<T extends Editor = Editor> extends WithElementType, Withable {
  isUrl(value: string): boolean;
  /**
   * To get the first previous text which is url and its range.
   */
  getFirstPrevTextAsUrlAndRange(editor: T, at: Location): { url: string; at: Range } | undefined;
  isSelectionInLink(editor: T): boolean;
  insertLink(editor: T, url: string, options?: LinkInsertLinkOptions): void;
  unwrapLink(editor: T, options?: LinkUnwrapLinkOptions): void;
  wrapLink(editor: T, url: string, options?: LinkWrapLinkOptions): void;
  upsertLink(editor: T, url: string, options?: LinkUpsertLinkOptions): void;
}
