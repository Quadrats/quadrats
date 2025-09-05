import { Editor, Transforms } from '@quadrats/core';
import { Table, TableTypes } from './typings';
import { TABLE_TYPES } from './constants';

export interface CreateTableOptions {
  types?: Partial<TableTypes>;
}

export function createTable(options: CreateTableOptions = {}): Table<Editor> {
  const { types: typesOptions } = options;

  const types: TableTypes = { ...TABLE_TYPES, ...typesOptions };

  const createTableElement: Table<Editor>['createTableElement'] = (rows, cols) => {
    const headerCells = Array.from({ length: cols }, () => ({
      type: types.table_cell,
      children: [{ text: '' }],
    }));

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
              children: headerCells,
            },
            ...bodyRows,
          ],
        },
      ],
    };
  };

  const insertTable: Table<Editor>['insertTable'] = (editor, rows, cols) => {
    Transforms.insertNodes(editor, createTableElement(rows, cols));
  };

  return {
    types,
    createTableElement,
    insertTable,
    with(editor) {
      return editor;
    },
  };
}
