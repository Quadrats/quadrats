import { isUrl as defaultIsUrl } from '@quadrats/utils';
import {
  Editor,
  Element,
  getAboveByTypes,
  getRangeBefore,
  getRangeBeforeFromAboveBlockStart,
  isNodesTypeIn,
  QuadratsElement,
  Range,
  Text,
  Transforms,
  unwrapNodesByTypes,
  WithElementType,
  wrapNodesWithUnhangRange,
} from '@quadrats/core';
import { Link, LinkElement } from './typings';
import { LINK_TYPE } from './constants';

export interface CreateLinkOptions extends Partial<WithElementType> {
  isUrl?: (value: string) => boolean;
  /**
   * If `true`, transform previous url text to link after entering a space.
   *
   * @default true
   */
  prevUrlToLinkAfterSpaceEntered?: boolean;
  /**
   * The types of void elements can be wrapped by link.
   * Let link be block element if wrap some wrappable blocks.
   */
  wrappableVoidTypes?: string[];
}

export function createLink({
  type = LINK_TYPE,
  isUrl = defaultIsUrl,
  prevUrlToLinkAfterSpaceEntered = true,
  wrappableVoidTypes,
}: CreateLinkOptions = {}): Link {
  const getFirstPrevTextAsUrlAndRange: Link['getFirstPrevTextAsUrlAndRange'] = (editor, at) => {
    /**
     * First, find all text under the same lowest above block and before entered space.
     */
    const rangeBeforeFromAboveBlockStart = getRangeBeforeFromAboveBlockStart(editor, at);

    if (rangeBeforeFromAboveBlockStart) {
      const textFromAboveBlockStart = Editor.string(editor, rangeBeforeFromAboveBlockStart);

      if (isUrl(textFromAboveBlockStart)) {
        return {
          at: rangeBeforeFromAboveBlockStart,
          url: textFromAboveBlockStart,
        };
      }
    }

    /**
     * Last, find the first previous word as url.
     */
    const beforeWordRange = getRangeBefore(editor, at, {
      acrossPaths: true,
      afterMatch: true,
      match: ' ',
    });

    if (beforeWordRange) {
      const beforeWordText = Editor.string(editor, beforeWordRange);

      if (isUrl(beforeWordText)) {
        return {
          at: beforeWordRange,
          url: beforeWordText,
        };
      }
    }
  };

  const isSelectionInLink: Link['isSelectionInLink'] = editor => isNodesTypeIn(editor, [type]);
  const insertLink: Link['insertLink'] = (editor, url, options = {}) => {
    const { text = url } = options;
    const link: LinkElement = {
      type,
      url: url.trim(),
      children: [{ text }],
    };

    Transforms.insertNodes(editor, link, options);
  };

  const unwrapLink: Link['unwrapLink'] = (editor, options = {}) => unwrapNodesByTypes(editor, [type], options);
  const wrapLink: Link['wrapLink'] = (editor, url, options = {}) => {
    const link: LinkElement = { type, url: url.trim(), children: [] };

    wrapNodesWithUnhangRange(editor, link, { ...options, split: true });
  };

  const upsertLink: Link['upsertLink'] = (editor, url, options = {}) => {
    const { at = editor.selection } = options;

    if (!at) {
      return;
    }

    if (Range.isCollapsed(at)) {
      if (wrappableVoidTypes) {
        const [node, path] = Editor.node(editor, at.focus.path);

        if (Text.isText(node) && !node.text) {
          const [wrappableVoid, wrappableVoidPath] = getAboveByTypes(editor, wrappableVoidTypes, {
            at: path,
          }) || [];

          if (wrappableVoid) {
            unwrapLink(editor, { at: wrappableVoidPath });
            wrapLink(editor, url, { at: wrappableVoidPath });
          } else {
            insertLink(editor, url, { at });
            Transforms.move(editor, { distance: url.length });
          }

          return;
        }
      }

      insertLink(editor, url, { at });
    } else {
      unwrapLink(editor, { at });
      wrapLink(editor, url, { at });
    }
  };

  return {
    type,
    isUrl,
    getFirstPrevTextAsUrlAndRange,
    isSelectionInLink,
    insertLink,
    unwrapLink,
    wrapLink,
    upsertLink,
    with(editor) {
      const { insertText, isInline, normalizeNode } = editor;

      if (prevUrlToLinkAfterSpaceEntered) {
        editor.insertText = (text) => {
          const { selection } = editor;

          if (text === ' ' && selection && Range.isCollapsed(selection)) {
            const shouldTransformedData = getFirstPrevTextAsUrlAndRange(editor, selection);

            if (shouldTransformedData) {
              const { at, url } = shouldTransformedData;

              unwrapLink(editor, { at });
              wrapLink(editor, url, {
                at: {
                  ...at,
                  /**
                   * Get a new selection here.
                   */
                  focus: editor.selection?.focus || at.focus,
                },
              });
            }
          }

          insertText(text);
        };
      }

      editor.isInline = (element) => {
        if ((element as QuadratsElement).type !== type) {
          return isInline(element);
        }

        if (!wrappableVoidTypes) {
          return true;
        }

        return !element.children.some(
          child => Editor.isBlock(editor, child)
          && Editor.isVoid(editor, child)
          && wrappableVoidTypes.includes((child as QuadratsElement).type as string),
        );
      };

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node) && (node as QuadratsElement).type === type) {
          /**
           * Remove invalid url.
           */
          if (!isUrl((node as LinkElement).url as string)) {
            Transforms.unwrapNodes(editor, { at: path });

            return;
          }

          /**
           * Remove empty content.
           */
          if (Text.isTextList(node.children)) {
            if (node.children.every(textNode => !textNode.text)) {
              Transforms.unwrapNodes(editor, { at: path });

              return;
            }
          }
        }

        normalizeNode(entry);
      };

      return editor;
    },
  };
}
