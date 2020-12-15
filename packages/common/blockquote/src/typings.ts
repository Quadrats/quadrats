import {
  Editor,
  Element,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface BlockquoteElement extends Element, WithElementType {}

export interface Blockquote extends WithElementType, Withable {
  isSelectionInBlockquote(editor: Editor): boolean;
  toggleBlockquote(editor: Editor): void;
}
