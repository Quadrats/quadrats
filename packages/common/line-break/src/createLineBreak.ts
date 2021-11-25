import {
  Element,
  // Editor,
  // isNodesTypeIn,
  normalizeVoidElementChildren,
  // toggleNodesType,
  // isInline,
  getNodesByTypes,
  // Path,
  // createParagraphElement,
  // normalizeVoidElementChildren,
  // normalizeOnlyInlineOrTextInChildren,
  // Text,
  Transforms,
  WithElementType,
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
  const getLineBreakNodes: LineBreak['getLineBreakNodes'] = (editor, options = {}) => (
    getNodesByTypes(editor, [LINE_BREAK_TYPE], { at: [], ...options })
  );

  const createLineBreakElement: LineBreak['createLineBreakElement'] = () => ({ type, children: [{ text: '' }] });

  const isSelectionInLineBreak: LineBreak['isSelectionInLineBreak'] = (editor, options = {}) => {
    const [match] = getLineBreakNodes(editor, options);
    console.log({ match });

    return !!match && match[0].type === type;
  };
  const toggleLineBreakNodes: LineBreak['toggleLineBreakNodes'] = (editor) => {
    const isActive = isSelectionInLineBreak(editor);
    const lineBreak: LineBreakElement = { type, children: [{ text: '' }] };

    const at: any = editor?.selection?.focus ?? [];
    // const nodes = Array.from(Editor.nodes(editor, { at }));

    // clone to store selection
    // const previousSelection = { ...editor.selection } as Location;

    // Transforms.setNodes(editor, lineBreak, { at: [] });

    // const root = editor.children

    // console.log({ editor, selection: editor?.selection, at, isActive });

    const start = at?.path?.[0] ?? 0;

    const end = at?.offset ?? 1000;

    if (isActive) {
      Transforms.removeNodes(editor, {
        at: [start],
        match: (node) => node.type === type,
      });
    } else {
      Transforms.insertNodes(editor, lineBreak, {
        at: [start, end],
        match: (node) => node.type === 'p',
        hanging: true,
      });
      // Transforms.move(editor);
    }

    // restore selection
    // Transforms.move(editor);
    // Transforms.move(editor, {  });
  };

  return {
    type,
    getLineBreakNodes,
    isSelectionInLineBreak,
    toggleLineBreakNodes,
    createLineBreakElement,
    with(editor) {
      const { isInline } = editor;

      editor.isInline = (element) => element.type === type || isInline(element);

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && node.type === type) {
          /**
           * Set invalid level elements to default.
           */

          console.log({ entry });

          if (normalizeVoidElementChildren(editor, [node, path])) {
            // eslint-disable-next-line no-useless-return
            return;
          }

          // normalizeNode(entry);
        }
      };

      return editor;
    },
  };
}
