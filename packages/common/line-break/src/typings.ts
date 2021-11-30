import {
  Editor,
  Element,
  GetNodesOptions,
  Node,
  NodeEntry,
  Withable,
  Text,
  WithElementType,
} from '@quadrats/core';

export interface LineBreakElement extends Element, WithElementType, Text {
  children: [Text];
}

export enum LineBreakVariant {
  ENTER = 'enter',
  SHIFT_ENTER = 'shift-enter',
}

export interface LineBreak extends WithElementType, Withable {
  getLineBreakNodes(editor: Editor, options?: GetNodesOptions): Generator<NodeEntry<Node>>;
  isSelectionInLineBreak(editor: Editor, options?: GetNodesOptions, variant?: LineBreakVariant): boolean;
  toggleLineBreakNodes(editor: Editor, variant?: LineBreakVariant): void;
}
