import {
  Editor,
  Element,
  isNodesTypeIn,
  Node,
  PARAGRAPH_TYPE,
  QuadratsElement,
  QuadratsText,
  Text,
  Transforms,
} from '@quadrats/core';
import { Table, TableElement, TableTypes } from './typings';
import { TABLE_TYPES } from './constants';
import { LIST_TYPES } from '@quadrats/common/list';
import {
  getCellLocation,
  getTableContainers,
  tryMoveToAdjacentRow,
  tryCrossBoundaryMove,
  tryMoveToNextCell,
  tryExtendSelectionHorizontal,
} from './utils';

export interface CreateTableOptions {
  types?: Partial<TableTypes>;
}

export function createTable(options: CreateTableOptions = {}): Table<Editor> {
  const { types: typesOptions } = options;

  const types: TableTypes = { ...TABLE_TYPES, ...typesOptions };

  const createTableElement: Table<Editor>['createTableElement'] = (rows, cols) => {
    return [
      {
        type: types.table,
        children: [
          { type: types.table_title, children: [{ text: '' }] },
          {
            type: types.table_main,
            children: [
              {
                type: types.table_body,
                children: Array.from({ length: rows }, () => ({
                  type: types.table_row,
                  children: Array.from({ length: cols }, () => ({
                    type: types.table_cell,
                    children: [
                      {
                        type: PARAGRAPH_TYPE,
                        children: [{ text: '' }],
                      },
                    ],
                  })),
                })),
              },
            ],
          },
        ],
      },
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ];
  };

  const isSelectionInTableMain: Table<Editor>['isSelectionInTableMain'] = (editor) =>
    isNodesTypeIn(editor, [types.table_main]);

  const isSelectionInTableCell: Table<Editor>['isSelectionInTableCell'] = (editor) =>
    isNodesTypeIn(editor, [types.table_cell]);

  const isSelectionInTableRow: Table<Editor>['isSelectionInTableRow'] = (editor) =>
    isNodesTypeIn(editor, [types.table_row]);

  const isSelectionInTableHeader: Table<Editor>['isSelectionInTableHeader'] = (editor) =>
    isNodesTypeIn(editor, [types.table_header]);

  const isSelectionInTableBody: Table<Editor>['isSelectionInTableBody'] = (editor) =>
    isNodesTypeIn(editor, [types.table_body]);

  const isSelectionInTableList: Table<Editor>['isSelectionInTableList'] = (editor) =>
    isNodesTypeIn(editor, [LIST_TYPES.ol, LIST_TYPES.ul]);

  const insertTable: Table<Editor>['insertTable'] = (editor, rows, cols) => {
    Transforms.insertNodes(editor, createTableElement(rows, cols));
  };

  const moveToNextCell: Table<Editor>['moveToNextCell'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const location = getCellLocation(editor, types);

      if (!location) return;

      const selectFn = (cellPath: number[], position: 'start' | 'end') => {
        const point = Editor[position](editor, cellPath);

        Transforms.select(editor, point);
      };

      // 嘗試移動到下一個 cell（同一列或下一列）
      if (tryMoveToNextCell(location, selectFn)) return;

      // 如果在 header，嘗試移動到 body 的第一個 cell（第一行）
      const containers = getTableContainers(editor, types, location.containerPath);

      if (!containers) return;

      // 使用 tryCrossBoundaryMove，指定 targetColumn 為 0（Tab 導航總是移動到第一行）
      if (tryCrossBoundaryMove(containers, location, 'down', selectFn, 0)) return;
    } catch (error) {
      console.warn('Failed to move to next cell:', error);
    }
  };

  const moveToRowAbove: Table<Editor>['moveToRowAbove'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const location = getCellLocation(editor, types);

      if (!location) return;

      const selectFn = (cellPath: number[], position: 'start' | 'end') => {
        const point = Editor[position](editor, cellPath);

        Transforms.select(editor, point);
      };

      // 嘗試移動到相鄰列（同一行）
      if (tryMoveToAdjacentRow(location, 'up', selectFn)) return;

      // 嘗試跨容器移動
      const containers = getTableContainers(editor, types, location.containerPath);

      if (!containers) return;

      if (tryCrossBoundaryMove(containers, location, 'up', selectFn)) return;
    } catch (error) {
      console.warn('Failed to move to row above:', error);
    }
  };

  const moveToRowBelow: Table<Editor>['moveToRowBelow'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const location = getCellLocation(editor, types);

      if (!location) return;

      const selectFn = (cellPath: number[], position: 'start' | 'end') => {
        const point = Editor[position](editor, cellPath);

        Transforms.select(editor, point);
      };

      // 嘗試移動到相鄰列（同一行）
      if (tryMoveToAdjacentRow(location, 'down', selectFn)) return;

      // 嘗試跨容器移動
      const containers = getTableContainers(editor, types, location.containerPath);

      if (!containers) return;

      if (tryCrossBoundaryMove(containers, location, 'down', selectFn)) return;
    } catch (error) {
      console.warn('Failed to move to row below:', error);
    }
  };

  const extendSelectionLeft: Table<Editor>['extendSelectionLeft'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      const location = getCellLocation(editor, types, focus);

      if (!location) return;

      tryExtendSelectionHorizontal(editor, location, 'left', anchor);
    } catch (error) {
      console.warn('Failed to extend selection left:', error);
    }
  };

  const extendSelectionRight: Table<Editor>['extendSelectionRight'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      const location = getCellLocation(editor, types, focus);

      if (!location) return;

      tryExtendSelectionHorizontal(editor, location, 'right', anchor);
    } catch (error) {
      console.warn('Failed to extend selection right:', error);
    }
  };

  const extendSelectionUp: Table<Editor>['extendSelectionUp'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor } = editor.selection;

      const location = getCellLocation(editor, types, editor.selection.focus);

      if (!location) return;

      const selectFn = (cellPath: number[], position: 'start' | 'end') => {
        const point = Editor[position](editor, cellPath);

        Transforms.select(editor, { anchor, focus: point });
      };

      // 嘗試移動到相鄰列（同一行）
      if (tryMoveToAdjacentRow(location, 'up', selectFn)) return;

      // 嘗試跨容器移動
      const containers = getTableContainers(editor, types, location.containerPath);

      if (!containers) return;

      if (tryCrossBoundaryMove(containers, location, 'up', selectFn)) return;
    } catch (error) {
      console.warn('Failed to extend selection up:', error);
    }
  };

  const extendSelectionDown: Table<Editor>['extendSelectionDown'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor } = editor.selection;

      const location = getCellLocation(editor, types, editor.selection.focus);

      if (!location) return;

      const selectFn = (cellPath: number[], position: 'start' | 'end') => {
        const point = Editor[position](editor, cellPath);

        Transforms.select(editor, { anchor, focus: point });
      };

      // 嘗試移動到相鄰列（同一行）
      if (tryMoveToAdjacentRow(location, 'down', selectFn)) return;

      // 嘗試跨容器移動
      const containers = getTableContainers(editor, types, location.containerPath);

      if (!containers) return;

      if (tryCrossBoundaryMove(containers, location, 'down', selectFn)) return;
    } catch (error) {
      console.warn('Failed to extend selection down:', error);
    }
  };

  return {
    types,
    createTableElement,
    insertTable,
    isSelectionInTableMain,
    isSelectionInTableCell,
    isSelectionInTableRow,
    isSelectionInTableHeader,
    isSelectionInTableBody,
    isSelectionInTableList,
    moveToNextCell,
    moveToRowAbove,
    moveToRowBelow,
    extendSelectionLeft,
    extendSelectionRight,
    extendSelectionUp,
    extendSelectionDown,
    with(editor) {
      const { insertFragment, deleteBackward, normalizeNode } = editor;

      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
          const type = (node as TableElement).type;

          // 1. 防止巢狀 table
          if (type === types.table) {
            for (const [, childPath] of Editor.nodes(editor, {
              at: path,
              match: (n) => Element.isElement(n) && (n as TableElement).type === types.table,
            })) {
              if (childPath.length > path.length) {
                Transforms.removeNodes(editor, { at: childPath });

                return;
              }
            }

            // 確保 table 有必要的結構：title + main
            const children = node.children.filter((child) => Element.isElement(child));
            const titleChild = children.find((child) => (child as TableElement).type === types.table_title);
            const mainChild = children.find((child) => (child as TableElement).type === types.table_main);

            if (!titleChild) {
              Transforms.insertNodes(editor, { type: types.table_title, children: [{ text: '' }] } as Node, {
                at: [...path, 0],
              });

              return;
            }

            if (!mainChild) {
              const mainIndex = titleChild ? 1 : 0;
              const tableMain: TableElement = {
                type: types.table_main,
                children: [
                  {
                    type: types.table_body,
                    children: [
                      {
                        type: types.table_row,
                        children: [
                          {
                            type: types.table_cell,
                            children: [
                              {
                                type: PARAGRAPH_TYPE,
                                children: [{ text: '' }],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              };

              Transforms.insertNodes(editor, tableMain, { at: [...path, mainIndex] });

              return;
            }
          }

          // 2. table_main 必須至少有一個 table_body
          if (type === types.table_main) {
            const children = node.children.filter((child) => Element.isElement(child));
            const bodyChild = children.find((child) => (child as TableElement).type === types.table_body);

            if (!bodyChild) {
              const tableBody: TableElement = {
                type: types.table_body,
                children: [
                  {
                    type: types.table_row,
                    children: [
                      {
                        type: types.table_cell,
                        children: [
                          {
                            type: PARAGRAPH_TYPE,
                            children: [{ text: '' }],
                          },
                        ],
                      },
                    ],
                  },
                ],
              };

              Transforms.insertNodes(editor, tableBody, { at: [...path, children.length] });

              return;
            }
          }

          // 3. table_header 和 table_body 必須有合理的 row 結構
          if (type === types.table_header) {
            const children = node.children.filter((child) => Element.isElement(child));
            const rowChildren = children.filter((child) => (child as TableElement).type === types.table_row);

            // 如果 header 沒有任何 row，移除整個 header
            if (rowChildren.length === 0) {
              Transforms.removeNodes(editor, { at: path });

              return;
            }
          }

          if (type === types.table_body) {
            const children = node.children.filter((child) => Element.isElement(child));
            const rowChildren = children.filter((child) => (child as TableElement).type === types.table_row);

            // body 必須至少有一個 row
            if (rowChildren.length === 0) {
              const tableRow: TableElement = {
                type: types.table_row,
                children: [
                  {
                    type: types.table_cell,
                    children: [
                      {
                        type: PARAGRAPH_TYPE,
                        children: [{ text: '' }],
                      },
                    ],
                  },
                ],
              };

              Transforms.insertNodes(editor, tableRow, { at: [...path, 0] });

              return;
            }
          }

          // 4. table_cell 只允許 paragraph、list
          if (type === types.table_cell) {
            const allowedTypes = [PARAGRAPH_TYPE, LIST_TYPES.ul, LIST_TYPES.ol];

            for (const [child, childPath] of Node.children(editor, path)) {
              if (Element.isElement(child)) {
                const childType = (child as QuadratsElement).type;

                // 如果不在白名單中，直接移除
                if (!allowedTypes.includes(childType)) {
                  Transforms.removeNodes(editor, { at: childPath });

                  return;
                }
              } else if (!Text.isText(child)) {
                // 如果不是 Element 也不是 Text，移除
                Transforms.removeNodes(editor, { at: childPath });

                return;
              }
            }
          }
        }

        normalizeNode(entry);
      };

      editor.deleteBackward = (unit) => {
        const { selection } = editor;

        if (selection) {
          // 檢查是否在 table_title 中
          const titleEntry = Editor.above(editor, {
            match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_title,
          });

          if (titleEntry) {
            const [, titlePath] = titleEntry;

            if (Editor.isStart(editor, selection.anchor, titlePath)) {
              // 在 table_title 開頭按 backspace，不執行任何操作
              return;
            }
          }

          // 檢查是否在 table_cell 中
          const cellEntry = Editor.above(editor, {
            match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_cell,
          });

          if (cellEntry) {
            const [, cellPath] = cellEntry;

            if (Editor.isStart(editor, selection.anchor, cellPath)) {
              // 在 table_cell 開頭按 backspace，不執行任何操作
              return;
            }
          }
        }

        // 執行預設的 deleteBackward 行為
        deleteBackward(unit);
      };

      /** 複製 Table Cell 內文字時觸發 */
      editor.insertFragment = (fragment) => {
        const cellEntry = Editor.above(editor, {
          match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_cell,
        });

        if (cellEntry) {
          // 在 table cell 中貼上時，只保留文字內容，不保留結構
          const textNodes: (QuadratsElement | QuadratsText)[] = [];

          const extractText = (nodes: (QuadratsElement | QuadratsText)[]) => {
            for (const node of nodes) {
              if (Element.isElement(node)) {
                extractText(node.children as QuadratsElement[]);
              } else if (node.text !== undefined) {
                textNodes.push(node);
              }
            }
          };

          extractText(fragment as QuadratsElement[]);

          // 如果有文字節點，將它們包裝成一個 paragraph 插入
          if (textNodes.length) {
            const textContent = textNodes.map((node) => (node as QuadratsText).text).join('');

            Transforms.insertText(editor, textContent);

            return;
          }
        }

        // 預設行為
        insertFragment(fragment);
      };

      return editor;
    },
  };
}
