import {
  Editor,
  QuadratsElement,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface BlockquoteElement extends QuadratsElement, WithElementType {}

export interface Blockquote<T extends Editor = Editor> extends WithElementType, Withable {
  unwrapBlockquote(editor: T): void;
  wrapBlockquote(editor: T): void;
  isSelectionInBlockquote(editor: T): boolean;
  toggleBlockquote(editor: T): void;
}
