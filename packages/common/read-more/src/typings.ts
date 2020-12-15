import {
  Editor,
  Element,
  Text,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface ReadMoreElement extends Element, WithElementType {
  children: [Text];
}

export interface ReadMore extends WithElementType, Withable {
  createReadMoreElement(): ReadMoreElement;
  insertReadMore(editor: Editor): void;
}
