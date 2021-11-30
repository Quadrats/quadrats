import {
  Element,
  Text,
} from 'slate';
import { Withable, WithElementType } from '../adapter/slate';

export interface LineBreakElement extends Element, WithElementType, Text {
  children: [Text];
}

export enum LineBreakVariant {
  ENTER = 'enter',
  SHIFT_ENTER = 'shift-enter',
}

export interface LineBreak extends WithElementType, Withable {

}
