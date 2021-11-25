/* eslint-disable no-useless-return */
import {
  Element,
  normalizeVoidElementChildren,
  getNodesByTypes,
  Transforms,
  WithElementType,
  Point,
} from '@quadrats/core';
import {
  LineBreak,
  LineBreakElement,
} from './typings';
import { LINE_BREAK_TYPE } from './constants';

export type CreateHLineBreakOptions = Partial<WithElementType>;

export function createLineBreak({
  type = LINE_BREAK_TYPE,
}: CreateHLineBreakOptions): LineBreak {
  const getLineBreakNodes: LineBreak['getLineBreakNodes'] = (editor, options) => (
    getNodesByTypes(editor, [LINE_BREAK_TYPE], { at: [], ...options })
  );

  const createLineBreakElement = (): LineBreakElement => ({
    type, text: '', children: [{ text: '' }],
  });

  const isSelectionInLineBreak: LineBreak['isSelectionInLineBreak'] = (editor, options = {}) => {
    const [match] = getLineBreakNodes(editor, options);
    return !!match && match[0].type === type;
  };
  const toggleLineBreakNodes: LineBreak['toggleLineBreakNodes'] = (editor) => {
    const at: Point = editor?.selection?.focus ?? { offset: 15, path: [] };
    const isActive = isSelectionInLineBreak(editor, { at });
    const lineBreak: LineBreakElement = createLineBreakElement();

    const start = at?.path?.[0] ?? 0;
    const end = at?.offset ?? 15; // slate 預設 end 最高為 15

    if (isActive) {
      Transforms.removeNodes(editor, {
        at: [start],
        match: (node) => node.type === type,
      });
    } else {
      editor.insertBreak();
      Transforms.insertNodes(editor, lineBreak, {
        at: [start, end],
        match: (node) => node.type === 'p',
        hanging: true,
        voids: true,
      });
    }
  };

  return {
    type,
    getLineBreakNodes,
    isSelectionInLineBreak,
    toggleLineBreakNodes,
    with(editor) {
      const { isInline } = editor;

      editor.isInline = (element) => element.type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && node.type === type) {
          /**
           * Set invalid level elements to default.
           */
          if (normalizeVoidElementChildren(editor, [node, path])) {
            return;
          }
        }
      };

      return editor;
    },
  };
}
