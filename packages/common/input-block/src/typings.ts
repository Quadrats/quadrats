import {
  Editor,
  QuadratsElement,
  NodeEntry,
  Withable,
} from '@quadrats/core';
import { InputWidgetConfig } from '@quadrats/common/input-widget';

export interface InputBlockElement extends QuadratsElement, InputWidgetConfig {
  type: string;
}

export interface InputBlock<T extends Editor = Editor> extends Withable {
  type: string;
  start(editor: T, config: InputWidgetConfig): void;
  remove(editor: T, entry: NodeEntry<InputBlockElement>, foucs: VoidFunction): void;
  confirm(element: InputBlockElement, value: string, remove: VoidFunction): void;
}
