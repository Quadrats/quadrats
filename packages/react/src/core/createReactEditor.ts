import { withReact } from 'slate-react';
import { createEditor } from '@quadrats/core';

export function createReactEditor() {
  return withReact(createEditor());
}
