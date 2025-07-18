import { KeyboardEvent } from 'react';
import { Range, QuadratsEditor, Editor, Element, QuadratsElement, Transforms } from '@quadrats/core';

export function removePreviousElement(
  event: KeyboardEvent<HTMLElement>,
  editor: QuadratsEditor & Editor,
  type: string,
) {
  const { selection } = editor;

  if (selection && Range.isCollapsed(selection)) {
    const currentEntry = Editor.above(editor, {
      match: (n) => Element.isElement(n),
    });

    if (currentEntry) {
      const [, currentPath] = currentEntry;

      if (Editor.isStart(editor, selection.anchor, currentPath)) {
        const previousEntry = Editor.previous(editor, {
          at: currentPath,
          match: (n) => Element.isElement(n) && (n as QuadratsElement).type === type,
        });

        if (previousEntry) {
          event.preventDefault();
          Transforms.removeNodes(editor, {
            at: previousEntry[1],
          });

          return;
        }
      }
    }
  }
}
