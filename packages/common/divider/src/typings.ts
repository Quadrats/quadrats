import {
  Editor,
  Element,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface DividerElement extends Element, WithElementType {
  children: [Text];
}

export interface Divider extends WithElementType, Withable {
  createDividerElement(): DividerElement;
  insertDivider(editor: Editor): void;
}
