import { ReactEditor, withReact } from 'slate-react';
import { createEditor } from '@quadrats/core';
import { QuadratsReactEditor } from '..';

export function createReactEditor() {
  return withReact(createEditor() as unknown as ReactEditor) as QuadratsReactEditor;
}
