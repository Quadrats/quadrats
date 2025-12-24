import { KeyboardEvent } from 'react';
import { Range, QuadratsEditor, Editor, Element, QuadratsElement, Node, Transforms, Path } from '@quadrats/core';

export function removePreviousElement({
  event,
  editor,
  type,
  confirmModal,
  doConfirm,
}: {
  event: KeyboardEvent<HTMLElement>;
  editor: QuadratsEditor & Editor;
  type: string;
  confirmModal: boolean;
  doConfirm?: (remove: VoidFunction) => void;
}) {
  const { selection } = editor;

  if (selection && Range.isCollapsed(selection)) {
    const currentEntry = Editor.above(editor, {
      match: (n) => Element.isElement(n),
    });

    if (currentEntry) {
      const [, currentPath] = currentEntry;

      if (Editor.isStart(editor, selection.anchor, currentPath)) {
        // const previousEntry = Editor.previous(editor, {
        //   at: currentPath,
        //   match: (n) => Element.isElement(n) && (n as QuadratsElement).type === type,
        // });
        let prevPath: Path = currentPath;

        try {
          prevPath = Path.previous(currentPath);
        } catch (ex) {
          // error
        }

        const prevNode = Node.get(editor, prevPath);

        if (Element.isElement(prevNode) && (prevNode as QuadratsElement).type === type) {
          event.preventDefault();

          const remove = () => {
            Transforms.removeNodes(editor, {
              at: prevPath,
            });
          };

          if (confirmModal) {
            doConfirm?.(remove);
          } else {
            remove();
          }

          return;
        }
      }
    }
  }
}
