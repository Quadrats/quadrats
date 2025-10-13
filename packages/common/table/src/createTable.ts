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
import { Table, TableTypes } from './typings';
import { TABLE_TYPES } from './constants';
import { LIST_TYPES } from '@quadrats/common/list';

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
      const cellEntry = Editor.above(editor, {
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [currentRow, rowPath] = rowEntry;
      const cellIndex = cellPath[cellPath.length - 1];
      const nextCellIndex = cellIndex + 1;

      // Try to move to next cell in current row
      if (nextCellIndex < currentRow.children.length) {
        const targetCellPath = [...rowPath, nextCellIndex];
        const point = Editor.start(editor, targetCellPath);

        Transforms.select(editor, point);

        return;
      }

      // Current row is full, try to move to next row
      const tableContainerEntry = Editor.above(editor, {
        at: rowPath,
        match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes(n.type),
      });

      if (!tableContainerEntry) return;

      const [tableContainer, tableContainerPath] = tableContainerEntry;
      const currentRowIndex = rowPath[rowPath.length - 1];
      const nextRowIndex = currentRowIndex + 1;

      // Try to move to next row in current container (header or body)
      if (nextRowIndex < tableContainer.children.length) {
        const nextRowPath = [...tableContainerPath, nextRowIndex];
        const targetCellPath = [...nextRowPath, 0];
        const point = Editor.start(editor, targetCellPath);

        Transforms.select(editor, point);

        return;
      }

      // If we're in header and no more rows, try to move to body
      if (Element.isElement(tableContainer) && tableContainer.type === types.table_header) {
        const tableMainEntry = Editor.above(editor, {
          at: tableContainerPath,
          match: (n) => Element.isElement(n) && n.type === types.table_main,
        });

        if (!tableMainEntry) return;

        const [tableMain] = tableMainEntry;
        const tableBody = tableMain.children.find(
          (child) => Element.isElement(child) && child.type === types.table_body,
        );

        if (tableBody && Element.isElement(tableBody) && tableBody.children.length > 0) {
          const tableMainPath = tableMainEntry[1];
          const tableBodyIndex = tableMain.children.findIndex((child) => child === tableBody);
          const firstRowPath = [...tableMainPath, tableBodyIndex, 0];
          const targetCellPath = [...firstRowPath, 0];
          const point = Editor.start(editor, targetCellPath);

          Transforms.select(editor, point);
        }
      }
    } catch (error) {
      console.warn('Failed to move to next cell:', error);
    }
  };

  const moveToRowAbove: Table<Editor>['moveToRowAbove'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const cellEntry = Editor.above(editor, {
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [, rowPath] = rowEntry;
      const currentRowIndex = rowPath[rowPath.length - 1];

      // 找到 table body 或 header 容器
      const containerEntry = Editor.above(editor, {
        at: rowPath,
        match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes(n.type),
      });

      if (!containerEntry) return;

      const [container, containerPath] = containerEntry;

      // 嘗試移動到上一個 row 的相同 column
      if (currentRowIndex > 0) {
        const targetRowPath = [...containerPath, currentRowIndex - 1];
        const targetRow = container.children[currentRowIndex - 1];

        if (Element.isElement(targetRow)) {
          // 確保目標 column 存在
          const targetColumnIndex = Math.min(currentColumnIndex, targetRow.children.length - 1);
          const targetCellPath = [...targetRowPath, targetColumnIndex];
          const point = Editor.start(editor, targetCellPath);

          Transforms.select(editor, point);
        }

        return;
      }

      // 如果在 body 的第一行，嘗試移動到 header 的最後一行
      if (Element.isElement(container) && container.type === types.table_body) {
        const tableMainEntry = Editor.above(editor, {
          at: containerPath,
          match: (n) => Element.isElement(n) && n.type === types.table_main,
        });

        if (!tableMainEntry) return;

        const [tableMain] = tableMainEntry;
        const tableHeader = tableMain.children.find(
          (child) => Element.isElement(child) && child.type === types.table_header,
        );

        if (tableHeader && Element.isElement(tableHeader) && tableHeader.children.length > 0) {
          const tableMainPath = tableMainEntry[1];
          const tableHeaderIndex = tableMain.children.findIndex((child) => child === tableHeader);
          const lastRowIndex = tableHeader.children.length - 1;
          const lastRow = tableHeader.children[lastRowIndex];

          if (Element.isElement(lastRow)) {
            const targetColumnIndex = Math.min(currentColumnIndex, lastRow.children.length - 1);
            const targetCellPath = [...tableMainPath, tableHeaderIndex, lastRowIndex, targetColumnIndex];
            const point = Editor.start(editor, targetCellPath);

            Transforms.select(editor, point);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to move to row above:', error);
    }
  };

  const moveToRowBelow: Table<Editor>['moveToRowBelow'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const cellEntry = Editor.above(editor, {
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [, rowPath] = rowEntry;
      const currentRowIndex = rowPath[rowPath.length - 1];

      // 找到 table body 或 header 容器
      const containerEntry = Editor.above(editor, {
        at: rowPath,
        match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes(n.type),
      });

      if (!containerEntry) return;

      const [container, containerPath] = containerEntry;

      // 嘗試移動到下一個 row 的相同 column
      if (currentRowIndex < container.children.length - 1) {
        const targetRowPath = [...containerPath, currentRowIndex + 1];
        const targetRow = container.children[currentRowIndex + 1];

        if (Element.isElement(targetRow)) {
          // 確保目標 column 存在
          const targetColumnIndex = Math.min(currentColumnIndex, targetRow.children.length - 1);
          const targetCellPath = [...targetRowPath, targetColumnIndex];
          const point = Editor.start(editor, targetCellPath);

          Transforms.select(editor, point);
        }

        return;
      }

      // 如果在 header 的最後一行，嘗試移動到 body 的第一行
      if (Element.isElement(container) && container.type === types.table_header) {
        const tableMainEntry = Editor.above(editor, {
          at: containerPath,
          match: (n) => Element.isElement(n) && n.type === types.table_main,
        });

        if (!tableMainEntry) return;

        const [tableMain] = tableMainEntry;
        const tableBody = tableMain.children.find(
          (child) => Element.isElement(child) && child.type === types.table_body,
        );

        if (tableBody && Element.isElement(tableBody) && tableBody.children.length > 0) {
          const tableMainPath = tableMainEntry[1];
          const tableBodyIndex = tableMain.children.findIndex((child) => child === tableBody);
          const firstRow = tableBody.children[0];

          if (Element.isElement(firstRow)) {
            const targetColumnIndex = Math.min(currentColumnIndex, firstRow.children.length - 1);
            const targetCellPath = [...tableMainPath, tableBodyIndex, 0, targetColumnIndex];
            const point = Editor.start(editor, targetCellPath);

            Transforms.select(editor, point);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to move to row below:', error);
    }
  };

  const extendSelectionLeft: Table<Editor>['extendSelectionLeft'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      // 找到 focus 點所在的 cell
      const cellEntry = Editor.above(editor, {
        at: focus,
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      // 檢查是否已經在第一列
      const isFirstColumn = currentColumnIndex === 0;

      if (isFirstColumn) {
        // 如果已經在第一列，將 focus 移動到該 cell 的開頭
        const cellStart = Editor.start(editor, cellPath);

        // 只有當 focus 還沒到開頭時才移動
        if (focus.offset > cellStart.offset || focus.path.length !== cellStart.path.length) {
          Transforms.select(editor, { anchor, focus: cellStart });
        }

        return;
      }

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [, rowPath] = rowEntry;

      // 找到左邊的 cell
      const targetCellPath = [...rowPath, currentColumnIndex - 1];
      const targetPoint = Editor.end(editor, targetCellPath);

      // 擴展選取範圍：保持 anchor 不變，移動 focus
      Transforms.select(editor, { anchor, focus: targetPoint });
    } catch (error) {
      console.warn('Failed to extend selection left:', error);
    }
  };

  const extendSelectionRight: Table<Editor>['extendSelectionRight'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      // 找到 focus 點所在的 cell
      const cellEntry = Editor.above(editor, {
        at: focus,
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [currentRow, rowPath] = rowEntry;

      // 檢查是否已經在最後一列
      const isLastColumn = currentColumnIndex >= currentRow.children.length - 1;

      if (isLastColumn) {
        // 如果已經在最後一列，將 focus 移動到該 cell 的結尾
        const cellEnd = Editor.end(editor, cellPath);

        // 只有當 focus 還沒到結尾時才移動
        if (focus.offset < cellEnd.offset || focus.path.length !== cellEnd.path.length) {
          Transforms.select(editor, { anchor, focus: cellEnd });
        }

        return;
      }

      // 找到右邊的 cell
      const targetCellPath = [...rowPath, currentColumnIndex + 1];
      const targetPoint = Editor.start(editor, targetCellPath);

      // 擴展選取範圍：保持 anchor 不變，移動 focus
      Transforms.select(editor, { anchor, focus: targetPoint });
    } catch (error) {
      console.warn('Failed to extend selection right:', error);
    }
  };

  const extendSelectionUp: Table<Editor>['extendSelectionUp'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      // 找到 focus 點所在的 cell
      const cellEntry = Editor.above(editor, {
        at: focus,
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [, rowPath] = rowEntry;
      const currentRowIndex = rowPath[rowPath.length - 1];

      // 找到 table body 或 header 容器
      const containerEntry = Editor.above(editor, {
        at: rowPath,
        match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes(n.type),
      });

      if (!containerEntry) return;

      const [container, containerPath] = containerEntry;

      // 嘗試移動到上一個 row 的相同 column
      if (currentRowIndex > 0) {
        const targetRowPath = [...containerPath, currentRowIndex - 1];
        const targetRow = container.children[currentRowIndex - 1];

        if (Element.isElement(targetRow)) {
          const targetColumnIndex = Math.min(currentColumnIndex, targetRow.children.length - 1);
          const targetCellPath = [...targetRowPath, targetColumnIndex];
          const targetPoint = Editor.start(editor, targetCellPath);

          // 擴展選取範圍
          Transforms.select(editor, { anchor, focus: targetPoint });
        }

        return;
      }

      // 如果在 body 的第一行，嘗試移動到 header 的最後一行
      if (Element.isElement(container) && container.type === types.table_body) {
        const tableMainEntry = Editor.above(editor, {
          at: containerPath,
          match: (n) => Element.isElement(n) && n.type === types.table_main,
        });

        if (!tableMainEntry) return;

        const [tableMain] = tableMainEntry;
        const tableHeader = tableMain.children.find(
          (child) => Element.isElement(child) && child.type === types.table_header,
        );

        if (tableHeader && Element.isElement(tableHeader) && tableHeader.children.length > 0) {
          const tableMainPath = tableMainEntry[1];
          const tableHeaderIndex = tableMain.children.findIndex((child) => child === tableHeader);
          const lastRowIndex = tableHeader.children.length - 1;
          const lastRow = tableHeader.children[lastRowIndex];

          if (Element.isElement(lastRow)) {
            const targetColumnIndex = Math.min(currentColumnIndex, lastRow.children.length - 1);
            const targetCellPath = [...tableMainPath, tableHeaderIndex, lastRowIndex, targetColumnIndex];
            const targetPoint = Editor.start(editor, targetCellPath);

            // 擴展選取範圍
            Transforms.select(editor, { anchor, focus: targetPoint });
          }
        }
      }
    } catch (error) {
      console.warn('Failed to extend selection up:', error);
    }
  };

  const extendSelectionDown: Table<Editor>['extendSelectionDown'] = (editor, types) => {
    if (!editor.selection) return;

    try {
      const { anchor, focus } = editor.selection;

      // 找到 focus 點所在的 cell
      const cellEntry = Editor.above(editor, {
        at: focus,
        match: (n) => Element.isElement(n) && n.type === types.table_cell,
      });

      if (!cellEntry) return;

      const [, cellPath] = cellEntry;
      const currentColumnIndex = cellPath[cellPath.length - 1];

      const rowEntry = Editor.above(editor, {
        at: cellPath,
        match: (n) => Element.isElement(n) && n.type === types.table_row,
      });

      if (!rowEntry) return;

      const [, rowPath] = rowEntry;
      const currentRowIndex = rowPath[rowPath.length - 1];

      // 找到 table body 或 header 容器
      const containerEntry = Editor.above(editor, {
        at: rowPath,
        match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes(n.type),
      });

      if (!containerEntry) return;

      const [container, containerPath] = containerEntry;

      // 嘗試移動到下一個 row 的相同 column
      if (currentRowIndex < container.children.length - 1) {
        const targetRowPath = [...containerPath, currentRowIndex + 1];
        const targetRow = container.children[currentRowIndex + 1];

        if (Element.isElement(targetRow)) {
          const targetColumnIndex = Math.min(currentColumnIndex, targetRow.children.length - 1);
          const targetCellPath = [...targetRowPath, targetColumnIndex];
          const targetPoint = Editor.end(editor, targetCellPath);

          // 擴展選取範圍
          Transforms.select(editor, { anchor, focus: targetPoint });
        }

        return;
      }

      // 如果在 header 的最後一行，嘗試移動到 body 的第一行
      if (Element.isElement(container) && container.type === types.table_header) {
        const tableMainEntry = Editor.above(editor, {
          at: containerPath,
          match: (n) => Element.isElement(n) && n.type === types.table_main,
        });

        if (!tableMainEntry) return;

        const [tableMain] = tableMainEntry;
        const tableBody = tableMain.children.find(
          (child) => Element.isElement(child) && child.type === types.table_body,
        );

        if (tableBody && Element.isElement(tableBody) && tableBody.children.length > 0) {
          const tableMainPath = tableMainEntry[1];
          const tableBodyIndex = tableMain.children.findIndex((child) => child === tableBody);
          const firstRow = tableBody.children[0];

          if (Element.isElement(firstRow)) {
            const targetColumnIndex = Math.min(currentColumnIndex, firstRow.children.length - 1);
            const targetCellPath = [...tableMainPath, tableBodyIndex, 0, targetColumnIndex];
            const targetPoint = Editor.end(editor, targetCellPath);

            // 擴展選取範圍
            Transforms.select(editor, { anchor, focus: targetPoint });
          }
        }
      }
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
      editor.normalizeNode = (entry) => {
        const [node, path] = entry;

        if (Element.isElement(node)) {
          const type = node.type;

          // 1. 防止巢狀 table
          if (type === types.table) {
            for (const [, childPath] of Editor.nodes(editor, {
              at: path,
              match: (n) => Element.isElement(n) && n.type === types.table,
            })) {
              if (childPath.length > path.length) {
                Transforms.removeNodes(editor, { at: childPath });

                return;
              }
            }

            // 確保 table 有必要的結構：title + main
            const children = node.children.filter((child) => Element.isElement(child));
            const titleChild = children.find((child) => child.type === types.table_title);
            const mainChild = children.find((child) => child.type === types.table_main);

            if (!titleChild) {
              Transforms.insertNodes(
                editor,
                { type: types.table_title, children: [{ text: '' }] },
                { at: [...path, 0] },
              );

              return;
            }

            if (!mainChild) {
              const mainIndex = titleChild ? 1 : 0;

              Transforms.insertNodes(
                editor,
                {
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
                },
                { at: [...path, mainIndex] },
              );

              return;
            }
          }

          // 2. table_main 必須至少有一個 table_body
          if (type === types.table_main) {
            const children = node.children.filter((child) => Element.isElement(child));
            const bodyChild = children.find((child) => child.type === types.table_body);

            if (!bodyChild) {
              Transforms.insertNodes(
                editor,
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
                { at: [...path, children.length] },
              );

              return;
            }
          }

          // 3. table_header 和 table_body 必須有合理的 row 結構
          if (type === types.table_header) {
            const children = node.children.filter((child) => Element.isElement(child));
            const rowChildren = children.filter((child) => child.type === types.table_row);

            // 如果 header 沒有任何 row，移除整個 header
            if (rowChildren.length === 0) {
              Transforms.removeNodes(editor, { at: path });

              return;
            }
          }

          if (type === types.table_body) {
            const children = node.children.filter((child) => Element.isElement(child));
            const rowChildren = children.filter((child) => child.type === types.table_row);

            // body 必須至少有一個 row
            if (rowChildren.length === 0) {
              Transforms.insertNodes(
                editor,
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
                { at: [...path, 0] },
              );

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
      };

      const { deleteBackward } = editor;

      editor.deleteBackward = (unit) => {
        const { selection } = editor;

        if (selection) {
          // 檢查是否在 table_title 中
          const titleEntry = Editor.above(editor, {
            match: (n) => Element.isElement(n) && n.type === types.table_title,
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
            match: (n) => Element.isElement(n) && n.type === types.table_cell,
          });

          if (cellEntry) {
            const [, cellPath] = cellEntry;

            // 檢查 cell 是否為空
            const cellText = Editor.string(editor, cellPath);

            if (!cellText.trim() && Editor.isStart(editor, selection.anchor, cellPath)) {
              // 在空的 table_cell 開頭按 backspace，不執行任何操作
              return;
            }
          }
        }

        // 執行預設的 deleteBackward 行為
        deleteBackward(unit);
      };

      /** 複製 Table Cell 內文字時觸發 */
      const { insertFragment } = editor;

      editor.insertFragment = (fragment) => {
        const cellEntry = Editor.above(editor, {
          match: (n) => Element.isElement(n) && n.type === types.table_cell,
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

      /** 從他處複製文字貼過來時觸發 */
      const { insertData } = editor;

      editor.insertData = (data) => {
        const { selection } = editor;

        if (!selection) {
          insertData(data);

          return;
        }

        // 先檢查選取的起點是否在 table cell 中
        const cellEntry = Editor.above(editor, {
          at: selection.anchor,
          match: (n) => Element.isElement(n) && n.type === types.table_cell,
        });

        if (cellEntry) {
          // 確認在 table 內，將選取範圍縮減到起點
          Transforms.collapse(editor, { edge: 'start' });

          // 重新取得 cell entry（使用當前游標位置）
          const targetCellEntry = Editor.above(editor, {
            match: (n) => Element.isElement(n) && n.type === types.table_cell,
          });

          if (!targetCellEntry) {
            insertData(data);

            return;
          }

          const [, cellPath] = targetCellEntry;

          // 從剪貼簿取得純文字
          const text = data.getData('text/plain');

          if (text) {
            // 檢測是否為表格格式（包含 Tab 或換行）
            const hasTableFormat = text.includes('\t') || text.includes('\n');

            if (hasTableFormat) {
              // 解析表格格式：行由 \n 分隔，欄位由 \t 分隔
              const rows = text.split('\n').filter((row) => row.length > 0);

              if (rows.length === 0) {
                return;
              }

              // 找到當前 cell 所在的 row 和 column index
              const rowEntry = Editor.above(editor, {
                at: cellPath,
                match: (n) => Element.isElement(n) && n.type === types.table_row,
              });

              if (!rowEntry) {
                // 如果找不到 row，降級為純文字插入
                Transforms.insertText(editor, text.replace(/\t/g, ' '));

                return;
              }

              const [, rowPath] = rowEntry;
              const currentColumnIndex = cellPath[cellPath.length - 1];

              // 找到 table body 或 header
              const containerEntry = Editor.above(editor, {
                at: rowPath,
                match: (n) => Element.isElement(n) && (n.type === types.table_body || n.type === types.table_header),
              });

              if (!containerEntry) {
                // 降級為純文字插入
                Transforms.insertText(editor, text.replace(/\t/g, ' '));

                return;
              }

              const [container, containerPath] = containerEntry;
              const currentRowIndex = rowPath[rowPath.length - 1];

              // 使用 Editor.withoutNormalizing 批次處理
              Editor.withoutNormalizing(editor, () => {
                rows.forEach((rowText, rowOffset) => {
                  const columns = rowText.split('\t');
                  const targetRowIndex = currentRowIndex + rowOffset;

                  // 檢查目標 row 是否存在
                  if (targetRowIndex >= container.children.length) {
                    return; // 超出範圍，跳過此行
                  }

                  const targetRow = container.children[targetRowIndex];

                  if (!Element.isElement(targetRow) || targetRow.type !== types.table_row) {
                    return;
                  }

                  // 貼上到各個 cell
                  columns.forEach((columnText, columnOffset) => {
                    const targetColumnIndex = currentColumnIndex + columnOffset;

                    // 檢查目標 cell 是否存在
                    if (targetColumnIndex >= targetRow.children.length) {
                      return; // 超出範圍，跳過此欄
                    }

                    const targetCellPath = [...containerPath, targetRowIndex, targetColumnIndex];

                    // 清空目標 cell 的內容
                    const targetCell = targetRow.children[targetColumnIndex];

                    if (Element.isElement(targetCell) && targetCell.type === types.table_cell) {
                      // 移除所有子節點
                      for (let i = targetCell.children.length - 1; i >= 0; i--) {
                        Transforms.removeNodes(editor, { at: [...targetCellPath, i] });
                      }

                      // 插入新內容
                      Transforms.insertNodes(
                        editor,
                        {
                          type: PARAGRAPH_TYPE,
                          children: [{ text: columnText }],
                        },
                        { at: [...targetCellPath, 0] },
                      );
                    }
                  });
                });
              });

              return;
            }
          }
        }

        // 預設行為
        insertData(data);
      };

      return editor;
    },
  };
}
