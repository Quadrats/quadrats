import { Editor, QuadratsElement, GetNodesOptions, Node, NodeEntry, Withable, WithElementType } from '@quadrats/core';

export interface ParagraphElement extends QuadratsElement {
  align?: 'left' | 'center' | 'right';
}

export interface Paragraph<T extends Editor = Editor> extends WithElementType, Withable {
  getParagraphNodes(editor: T, options?: GetNodesOptions): Generator<NodeEntry<Node>>;
  isSelectionInParagraph(editor: T, options?: GetNodesOptions): boolean;
  setParagraphNodes(editor: T): void;
}
