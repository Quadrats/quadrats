import {
  Editor,
  QuadratsElement,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface ReadMoreElement extends QuadratsElement, WithElementType {
  children: [Text];
}

export interface ReadMore<T extends Editor = Editor> extends WithElementType, Withable {
  createReadMoreElement(): ReadMoreElement;
  insertReadMore(editor: T): void;
}
