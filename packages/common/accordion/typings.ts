import {
  Editor,
  Withable,
  WithElementType,
} from '@quadrats/core';

export interface Accordion<T extends Editor = Editor> extends WithElementType, Withable {
  insertAccordion(editor: T): void;
}
