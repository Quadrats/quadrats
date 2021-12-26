import {
  Editor,
  QuadratsElement,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface BlockquoteElement extends QuadratsElement, WithElementType {}

export interface Blockquote<T extends Editor = Editor> extends WithElementType, Withable {
  isSelectionInBlockquote(editor: T): boolean;
  toggleBlockquote(editor: T): void;
}
