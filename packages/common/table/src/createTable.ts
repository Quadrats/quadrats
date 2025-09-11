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
    const bodyRows = Array.from({ length: rows - 1 }, () => ({
      type: types.table_row,
      children: Array.from({ length: cols }, () => ({
        type: types.table_cell,
        children: [{ text: '' }],
      })),
    }));

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
              children: bodyRows,
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
      return editor;
    },
  };
}
