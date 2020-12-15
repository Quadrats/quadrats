import {
  Editor,
  Element,
  NodeEntry,
  Withable,
} from '@quadrats/core';
import { InputWidgetConfig } from '@quadrats/common/input-widget';

export interface InputBlockElement extends Element, InputWidgetConfig {
  type: string;
}

export interface InputBlock extends Withable {
  type: string;
  start(editor: Editor, config: InputWidgetConfig): void;
  remove(editor: Editor, entry: NodeEntry<InputBlockElement>, foucs: VoidFunction): void;
  confirm(element: InputBlockElement, value: string, remove: VoidFunction): void;
}
