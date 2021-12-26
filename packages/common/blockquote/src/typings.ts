import {
  Editor,
  QuadratsElement,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface BlockquoteElement extends QuadratsElement, WithElementType {}

export interface Blockquote extends WithElementType, Withable {
  isSelectionInBlockquote(editor: Editor): boolean;
  toggleBlockquote(editor: Editor): void;
}
