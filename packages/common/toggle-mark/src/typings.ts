import { Editor, WithMarkType } from '@quadrats/core';

export interface ToggleMark<T extends Editor = Editor> extends WithMarkType {
  isToggleMarkActive(editor: T): boolean;
  toggleMark(editor: T): void;
}
