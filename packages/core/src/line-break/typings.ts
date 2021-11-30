import {
  Element,
  Withable,
  Text,
  WithElementType,
} from '@quadrats/core';

export interface LineBreakElement extends Element, WithElementType, Text {
  children: [Text];
}

export enum LineBreakVariant {
  ENTER = 'enter',
  SHIFT_ENTER = 'shift-enter',
}

export interface LineBreak extends WithElementType, Withable {

}
