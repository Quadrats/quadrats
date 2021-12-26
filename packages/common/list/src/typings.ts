import {
  Editor,
  QuadratsElement,
  Location,
  Node,
  NodeEntry,
  Withable,
  WithElementType,
} from '@quadrats/core';

export type ListRootTypeKey = 'ol' | 'ul';
export type ListItemTypeKey = 'li';
export type ListTypeKey = ListRootTypeKey | ListItemTypeKey;
export type ListTypes = Record<ListTypeKey, string>;

export interface ListElement extends QuadratsElement, WithElementType {}

export interface ListAboveListAndItem {
  list: NodeEntry<QuadratsElement>;
  listItem: NodeEntry<QuadratsElement>;
}

export interface ListGetAboveListEntriesOptions {
  at?: Location;
}

export interface List<T extends Editor = Editor> extends Withable {
  /**
   * An object which keys are `ul`, `ol`, `li` and values are the corresponding element types.
   */
  types: ListTypes;
  isListElement(node: Node): node is QuadratsElement;
  isListItemElement(node: Node): node is QuadratsElement;
  isSelectionInList(editor: T, listTypeKey: ListRootTypeKey): boolean;
  /**
   * If expanded, get the list wrapping the location.
   */
  getAboveListAndItem(editor: T, options?: ListGetAboveListEntriesOptions): ListAboveListAndItem | undefined;
  unwrapList(editor: T): void;
  toggleList(editor: T, listTypeKey: ListRootTypeKey, defaultType?: string): void;
  /**
   * Increase the depth of the first item in the location if increasable.
   */
  increaseListItemDepth(editor: T, entries: ListAboveListAndItem): void;
  /**
   * Decrease the depth of the first item in the location if decreasable.
   */
  decreaseListItemDepth(editor: T, entries: ListAboveListAndItem): void;
  /**
   * Unwrap the list if at root, or decrease the depth of list item.
   */
  decreaseListItemDepthOrUnwrapIfNeed(editor: T, entries: ListAboveListAndItem): void;
}
