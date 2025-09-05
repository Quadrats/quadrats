import { Editor, QuadratsElement, Text, Withable, WithElementType } from '@quadrats/core';

export type TableTypeKey = 'table'; // 元件最外層
export type TableTitleTypeKey = 'table_title'; // 表格標題
export type TableMainTypeKey = 'table_main'; // 表格主要內容區
export type TableHeaderTypeKey = 'table_header'; // 表格表頭
export type TableRowTypeKey = 'table_row'; // 表格 row
export type TableCellTypeKey = 'table_cell'; // 表格儲存格

export type TableTypes = Record<
  TableTypeKey | TableTitleTypeKey | TableMainTypeKey | TableHeaderTypeKey | TableRowTypeKey | TableCellTypeKey,
  string
>;

export interface TableElement extends QuadratsElement, WithElementType {
  children: {
    type: string;
    children: TableElement['children'] | Text[];
  }[];
}

export interface Table<T extends Editor = Editor> extends Withable {
  types: TableTypes;
  createTableElement(rows: number, cols: number): TableElement;
  insertTable(editor: T, rows: number, cols: number): void;
}
