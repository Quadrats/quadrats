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
  LineBreakVariant,
} from './typings';
import { LINE_BREAK_TYPE } from './constants';

export type CreateHLineBreakOptions = Partial<WithElementType>;

export function createLineBreak({
  type = LINE_BREAK_TYPE,
}: CreateHLineBreakOptions): LineBreak {
  const getLineBreakNodes: LineBreak['getLineBreakNodes'] = (editor, options) => (
    getNodesByTypes(editor, [LINE_BREAK_TYPE], { at: [], ...options })
  );

  const createLineBreakElement = (variant?: LineBreakVariant): LineBreakElement => ({
    type, text: variant ?? '', children: [{ text: '' }],
  });

  const isSelectionInLineBreak: LineBreak['isSelectionInLineBreak'] = (editor, options = {}) => {
    const at: Point = editor?.selection?.focus ?? { offset: 15, path: [] };
    const start = at?.path?.[0] ?? 0;

    const [match] = getLineBreakNodes(editor, { at: [start], ...options });
    return !!match && match[0].type === type;
  };
  const toggleLineBreakNodes: LineBreak['toggleLineBreakNodes'] = (editor, variant) => {
    const at: Point = editor?.selection?.focus ?? { offset: 15, path: [] };
    const isActive = isSelectionInLineBreak(editor, { at });

    const start = at?.path?.[0] ?? 0;
    const end = 15; // slate 預設 end 最高為 15

    if (isActive) {
      Transforms.removeNodes(editor, {
        at: [start],
        match: (node) => node.type === type,
      });
    } else {
      const lineBreak: LineBreakElement = createLineBreakElement(variant);

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
          normalizeVoidElementChildren(editor, [node, path]);
        }
      };

      return editor;
    },
  };
}
