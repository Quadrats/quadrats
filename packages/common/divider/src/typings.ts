import {
  Editor,
  QuadratsElement,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface DividerElement extends QuadratsElement, WithElementType {
  children: [Text];
}

export interface Divider<T extends Editor = Editor> extends WithElementType, Withable {
  createDividerElement(): DividerElement;
  insertDivider(editor: T): void;
}
