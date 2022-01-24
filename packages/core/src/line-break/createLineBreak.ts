import { Element, Transforms } from 'slate';
import { LineBreak } from './typings';
import { LINE_BREAK_TYPE } from './constants';
import { WithElementType } from '../adapter/slate';
import { QuadratsElement, QuadratsText } from '../typings';

export type CreateLineBreakOptions = Partial<WithElementType>;

export function createLineBreak({
  type = LINE_BREAK_TYPE,
}: CreateLineBreakOptions): LineBreak {
  return {
    type,
    with(editor) {
      const { isInline, normalizeNode } = editor;

      editor.isInline = element => (element as QuadratsElement).type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          // move out children if something inserted in the line-break node
          // line-break children is only allow '\n' text
          // other node or text should be move out
          node.children?.forEach((child, index) => {
            const element = child as QuadratsElement;

            if (element?.type || (child as QuadratsText)?.text !== '\n') {
              const moveto = path.slice();

              moveto[(path.length - 1)] += 1;

              Transforms.moveNodes(editor, { at: path.concat(index), to: moveto });
            }
          });

          // remove LineBreak node if children text '\n' has been removed
          if (node.children.length === 1 && ((node.children?.[0] as QuadratsText)?.text === '')
            || node.children.length < 1) {
            Transforms.removeNodes(editor, { at: path });
          }
        } else {
          normalizeNode(entry);
        }
      };

      return editor;
    },
  };
}
