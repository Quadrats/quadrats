import { Text } from 'slate';
import { QuadratsElement } from '..';
import { Withable, WithElementType } from '../adapter/slate';

export interface LineBreakElement extends QuadratsElement, WithElementType, Text {
  children: [Text];
}

export enum LineBreakVariant {
  ENTER = 'enter',
  SHIFT_ENTER = 'shift-enter',
}

export interface LineBreak extends WithElementType, Withable {

}
