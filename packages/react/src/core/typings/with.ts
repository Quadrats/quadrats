import { Editor } from '@quadrats/react';

export interface ReactWithable<R = undefined> {
  with: <T extends Editor>(editor: T) => R extends undefined ? T : T & R;
}
