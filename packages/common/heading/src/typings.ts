import {
  Editor,
  Element,
  GetNodesOptions,
  Node,
  NodeEntry,
  Withable,
  WithElementType,
} from '@quadrats/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingElement extends Element, WithElementType {
  level: HeadingLevel;
}

export interface WithEnabledHeadingLevels<L extends HeadingLevel> {
  /**
   * Only consider heading element which level in enabled levels as valid heading element.
   */
  enabledLevels: ReadonlyArray<L>;
}

export interface Heading<L extends HeadingLevel> extends WithElementType, Withable, WithEnabledHeadingLevels<L> {
  getHeadingNodes(editor: Editor, level: L, options?: GetNodesOptions): Generator<NodeEntry<Node>>;
  isSelectionInHeading(editor: Editor, level: L, options?: GetNodesOptions): boolean;
  toggleHeadingNodes(editor: Editor, level: L, defaultType?: string): void;
}
