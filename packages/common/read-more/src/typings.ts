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

export interface ReadMore extends WithElementType, Withable {
  createReadMoreElement(): ReadMoreElement;
  insertReadMore(editor: Editor): void;
}
