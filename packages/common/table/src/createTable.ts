import { Editor, Element, isNodesTypeIn, Transforms } from '@quadrats/core';
import { Table, TableTypes } from './typings';
import { TABLE_TYPES } from './constants';

export interface CreateTableOptions {
  types?: Partial<TableTypes>;
}

export function createTable(options: CreateTableOptions = {}): Table<Editor> {
  const { types: typesOptions } = options;

  const types: TableTypes = { ...TABLE_TYPES, ...typesOptions };

  const createTableElement: Table<Editor>['createTableElement'] = (rows, cols) => {
    return {
      type: types.table,
      children: [
        { type: types.table_title, children: [{ text: '' }] },
        {
          type: types.table_main,
          children: [
            {
              type: types.table_header,
              children: [
                {
                  type: types.table_row,
                  children: Array.from({ length: cols }, () => ({
                    type: types.table_cell,
                    children: [{ text: '' }],
                  })),
                },
              ],
            },
            {
              type: types.table_body,
              children: Array.from({ length: rows - 1 }, () => ({
                type: types.table_row,
                children: Array.from({ length: cols }, () => ({
                  type: types.table_cell,
                  children: [{ text: '' }],
                })),
              })),
            },
          ],
        },
      ],
    };
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

  return {
    types,
    createTableElement,
    insertTable,
    isSelectionInTableMain,
    isSelectionInTableCell,
    isSelectionInTableRow,
    isSelectionInTableHeader,
    isSelectionInTableBody,
    moveToNextCell,
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
                          children: [{ type: types.table_cell, children: [{ text: '' }] }],
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
                      children: [{ type: types.table_cell, children: [{ text: '' }] }],
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
                  children: [{ type: types.table_cell, children: [{ text: '' }] }],
                },
                { at: [...path, 0] },
              );

              return;
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

            // 檢查 title 是否為空或只有空白
            const titleText = Editor.string(editor, titlePath);

            if (!titleText.trim() && Editor.isStart(editor, selection.anchor, titlePath)) {
              // 在空的 table_title 開頭按 backspace，不執行任何操作
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

      return editor;
    },
  };
}
