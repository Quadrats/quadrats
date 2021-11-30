/* eslint-disable no-useless-return */
import {
  Element,
  normalizeVoidElementChildren,
  getNodesByTypes,
  Transforms,
  WithElementType,
  Text,
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

  const isSelectionInLineBreak: LineBreak['isSelectionInLineBreak'] = (editor, options = {}, variant) => {
    const at: Point = editor?.selection?.focus ?? { offset: 15, path: [] };
    const start = at?.path?.[0] ?? 0;

    const [match] = getLineBreakNodes(editor, { at: [start], ...options });
    return !!match && match[0].type === type && match[0].text === variant;
  };

  const getCurrentAt = (editor: any): Point => (
    editor?.selection?.focus ?? { offset: 15, path: [] }
  );

  const toggleLineBreakNodes: LineBreak['toggleLineBreakNodes'] = (editor, variant) => {
    const at: Point = getCurrentAt(editor);
    const isActive = isSelectionInLineBreak(editor, { at });
    const start = at?.path?.[0] ?? 0;

    if (variant === LineBreakVariant.ENTER) {
      if (isActive) {
        Transforms.removeNodes(editor, {
          at: [start],
          match: (node) => node.type === type,
        });
      } else {
        const lineBreak: LineBreakElement = createLineBreakElement(variant);

        editor.insertBreak();
        Transforms.insertNodes(editor, lineBreak, {
          at: [start, 15],
          match: (node) => Text.isText(node),
          hanging: true,
          voids: true,
        });
      }
    }
    if (variant === LineBreakVariant.SHIFT_ENTER) {
      const lineBreak: LineBreakElement = createLineBreakElement(variant);

      /**
       * @INFO 在 line-break icon 後面放一個 null tag
       * 使得 selection 可以在同層級之間進行跳行的動作
       * 否則無法跳行。
      */
      Transforms.insertNodes(editor, [
        lineBreak,
        { text: '\0' },
      ], { at });
      Transforms.move(editor, { distance: 2 });
    }
  };

  return {
    type,
    getLineBreakNodes,
    isSelectionInLineBreak,
    toggleLineBreakNodes,
    with(editor) {
      const { isInline, normalizeNode } = editor;

      editor.isInline = (element) => element.type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && node.type === type) {
          /**
           * Set invalid level elements to default.
           */
          normalizeVoidElementChildren(editor, [node, path]);
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
