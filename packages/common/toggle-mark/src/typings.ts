import { Editor, WithMarkType } from '@quadrats/core';

export interface ToggleMark extends WithMarkType {
  isToggleMarkActive(editor: Editor): boolean;
  toggleMark(editor: Editor): void;
}
