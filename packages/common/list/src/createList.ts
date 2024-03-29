import {
  deleteSelectionFragmentIfExpanded,
  Editor,
  QuadratsElement,
  getAboveByTypes,
  getNodesByTypes,
  getParent,
  isAboveBlockEmpty,
  isFirstChild,
  isNodesTypeIn,
  isSelectionAtBlockEdge,
  NodeEntry,
  PARAGRAPH_TYPE,
  Path,
  Range,
  Transforms,
  unwrapNodesByTypes,
  wrapNodesWithUnhangRange,
} from '@quadrats/core';
import { List, ListTypes } from './typings';
import { LIST_TYPES } from './constants';

export interface CreateListOptions {
  types?: Partial<ListTypes>;
}

export function createList(options: CreateListOptions = {}): List {
  const types: ListTypes = { ...LIST_TYPES, ...options.types };
  const isListElement: List['isListElement'] = (
    node,
  ): node is QuadratsElement => [types.ol, types.ul].includes((node as QuadratsElement).type as string);

  const isListItemElement: List['isListElement'] = (node): node is QuadratsElement => (
    node as QuadratsElement).type === types.li;

  const isSelectionInList: List['isSelectionInList'] = (
    editor,
    listTypeKey,
  ) => isNodesTypeIn(editor, [types[listTypeKey]]);

  const getAboveListAndItem: List['getAboveListAndItem'] = (editor, options = {}) => {
    const { at = editor.selection } = options;

    /**
     * (ul|ol) > li > p
     */
    if (at && isNodesTypeIn(editor, [types.li])) {
      const parentEntry = getAboveByTypes<QuadratsElement>(editor, [types.li]) || getParent(editor, at);

      if (parentEntry && isListItemElement(parentEntry[0])) {
        const [, listItemPath] = parentEntry;
        const parentOfListItemEntry = getParent(editor, listItemPath);

        if (parentOfListItemEntry && isListElement(parentOfListItemEntry[0])) {
          return {
            list: parentOfListItemEntry as NodeEntry<QuadratsElement>,
            listItem: parentEntry as NodeEntry<QuadratsElement>,
          };
        }
      }
    }
  };

  const unwrapList: List['unwrapList'] = (editor) => {
    unwrapNodesByTypes(editor, [types.li]);
    unwrapNodesByTypes(editor, [types.ol, types.ul], { split: true });
  };

  const toggleList: List['toggleList'] = (editor, listTypeKey, defaultType = PARAGRAPH_TYPE) => {
    if (!editor.selection) {
      return;
    }

    const isActive = isSelectionInList(editor, listTypeKey);

    unwrapList(editor);
    Transforms.setNodes(editor, {
      type: defaultType,
    } as QuadratsElement);

    if (!isActive) {
      wrapNodesWithUnhangRange(editor, { type: types[listTypeKey], children: [] } as QuadratsElement);

      const nodeEntries = getNodesByTypes(editor, [defaultType]);
      const listItem = { type: types.li, children: [] };

      for (const [, path] of nodeEntries) {
        wrapNodesWithUnhangRange(editor, listItem, {
          at: path,
        });
      }
    }
  };

  const increaseListItemDepth: List['increaseListItemDepth'] = (editor, entries) => {
    const {
      list: [listNode],
      listItem: [, listItemPath],
    } = entries;

    if (!isFirstChild(listItemPath)) {
      const previousEntry = Editor.node(editor, Path.previous(listItemPath)) as NodeEntry<QuadratsElement>;

      if (previousEntry) {
        const [previousNode, previousPath] = previousEntry;
        const lastNodeOfPreviousNode = (previousNode?.children ?? [])[(previousNode?.children ?? []).length - 1];

        /**
         * Move list item next to the last node of previous node of list item.
         */
        if (isListElement(lastNodeOfPreviousNode)) {
          Transforms.moveNodes(editor, {
            at: listItemPath,
            to: [
              ...previousPath,
              (previousNode?.children ?? []).length - 1,
              (lastNodeOfPreviousNode?.children ?? []).length,
            ],
          });
          /**
           * Wrap list item by a new list and move the new list next to the last node of previous node.
           */
        } else {
          const newSubListElement = { type: (listNode as QuadratsElement).type, children: [] };

          Transforms.wrapNodes(editor, newSubListElement, { at: listItemPath });
          Transforms.moveNodes(editor, {
            at: listItemPath,
            to: [...previousPath, (previousNode?.children ?? []).length],
          });
        }
      }
    }
  };

  const decreaseListItemDepth: List['decreaseListItemDepth'] = (editor, entries) => {
    const {
      list: [listNode, listPath],
      listItem: [listItemNode, listItemPath],
    } = entries;

    const [listParentNode, listParentPath] = Editor.parent(editor, listPath);

    /**
     * Decreasable if parent of list is list item.
     */
    if (!isListItemElement(listParentNode)) {
      return;
    }

    const newListItemPath = Path.next(listParentPath);
    const listItemIndex = listItemPath[listItemPath.length - 1];
    const nextSiblingListItems = (listNode?.children ?? []).slice(listItemIndex + 1, (listNode?.children ?? []).length);

    Transforms.moveNodes(editor, {
      at: listItemPath,
      to: newListItemPath,
    });

    /**
     * After list item moved to parent list, if there are some sibling list items next to list item, move them to a new list in list item.
     */
    if (nextSiblingListItems.length) {
      const newSubListElement = { type: (listNode as QuadratsElement).type, children: [] };
      const newSubListPath = [...newListItemPath, (listItemNode?.children ?? []).length];

      Transforms.insertNodes(editor, newSubListElement, { at: newSubListPath });
      nextSiblingListItems.forEach((_, index) => {
        Transforms.moveNodes(editor, {
          /**
           * Path of each nextSiblingListItems is the same as listItemPath.
           * Since each time list item moved, path of next list item will be unshifted.
           */
          at: listItemPath,
          to: [...newSubListPath, index],
        });
      });
    }

    /**
     * Remove the stale sublist if there are no previous sibling list items.
     */
    if (listItemIndex <= 0) {
      Transforms.removeNodes(editor, {
        at: listPath,
      });
    }
  };

  const decreaseListItemDepthOrUnwrapIfNeed: List['decreaseListItemDepthOrUnwrapIfNeed'] = (editor, entries) => {
    const {
      list: [, listPath],
    } = entries;

    const [listParentNode] = Editor.parent(editor, listPath);

    if ((listParentNode as QuadratsElement).type !== types.li) {
      unwrapList(editor);
    } else {
      decreaseListItemDepth(editor, entries);
    }
  };

  return {
    types,
    isListElement,
    isListItemElement,
    isSelectionInList,
    getAboveListAndItem,
    unwrapList,
    toggleList,
    increaseListItemDepth,
    decreaseListItemDepth,
    decreaseListItemDepthOrUnwrapIfNeed,
    with(editor) {
      const { deleteBackward, insertBreak } = editor;

      editor.deleteBackward = (unit) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const entries = getAboveListAndItem(editor);

          if (entries && isSelectionAtBlockEdge(editor) === 'start') {
            decreaseListItemDepthOrUnwrapIfNeed(editor, entries);

            return;
          }
        }

        deleteBackward(unit);
      };

      editor.insertBreak = () => {
        const entries = getAboveListAndItem(editor);

        if (entries) {
          deleteSelectionFragmentIfExpanded(editor);

          if (isAboveBlockEmpty(editor, { match: isListItemElement })) {
            decreaseListItemDepthOrUnwrapIfNeed(editor, entries);
          } else {
            Transforms.splitNodes(editor, {
              at: editor.selection?.focus,
              match: isListItemElement,
              always: true,
            });
          }
        } else {
          insertBreak();
        }
      };

      return editor;
    },
  };
}
