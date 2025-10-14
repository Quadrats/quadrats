import { Editor, QuadratsElement, GetNodesOptions, Node, NodeEntry, Withable, WithElementType } from '@quadrats/core';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingElement extends QuadratsElement, WithElementType {
  level: HeadingLevel;
  align?: 'left' | 'center' | 'right';
}

export interface WithEnabledHeadingLevels<L extends HeadingLevel> {
  /**
   * Only consider heading element which level in enabled levels as valid heading element.
   */
  enabledLevels: ReadonlyArray<L>;
}

export interface Heading<L extends HeadingLevel, T extends Editor = Editor>
  extends WithElementType,
    Withable,
    WithEnabledHeadingLevels<L> {
  getHeadingNodes(editor: T, level: L, options?: GetNodesOptions): Generator<NodeEntry<Node>>;
  isSelectionInHeading(editor: T, level: L, options?: GetNodesOptions): boolean;
  toggleHeadingNodes(editor: T, level: L, defaultType?: string): void;
}
