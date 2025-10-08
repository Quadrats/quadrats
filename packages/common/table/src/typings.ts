import { Editor, QuadratsElement, Text, Withable, WithElementType } from '@quadrats/core';

export type TableTypeKey = 'table'; // 元件最外層
export type TableTitleTypeKey = 'table_title'; // 表格標題
export type TableMainTypeKey = 'table_main'; // 表格主要內容區
export type TableHeaderTypeKey = 'table_header'; // 表格表頭
export type TableBodyTypeKey = 'table_body'; // 表格表身
export type TableRowTypeKey = 'table_row'; // 表格 row
export type TableCellTypeKey = 'table_cell'; // 表格儲存格

export type TableTypes = Record<
  | TableTypeKey
  | TableTitleTypeKey
  | TableMainTypeKey
  | TableHeaderTypeKey
  | TableBodyTypeKey
  | TableRowTypeKey
  | TableCellTypeKey,
  string
>;

// Column width can be either percentage (flexible) or pixel (fixed)
export type ColumnWidth =
  | { type: 'percentage'; value: number } // e.g., { type: 'percentage', value: 30 } means 30%
  | { type: 'pixel'; value: number }; // e.g., { type: 'pixel', value: 200 } means 200px

export interface TableElement extends QuadratsElement, WithElementType {
  treatAsTitle?: boolean;
  pinned?: boolean;
  align?: 'left' | 'center' | 'right';
  columnWidths?: ColumnWidth[]; // Array of column width definitions (percentage or pixel)
  scrollPosition?: { scrollLeft: number; scrollTop: number }; // Scroll position for the table
  children: {
    type: string;
    treatAsTitle?: boolean;
    pinned?: boolean;
    align?: 'left' | 'center' | 'right';
    children: TableElement['children'] | Text[];
  }[];
}

export interface Table<T extends Editor = Editor> extends Withable {
  types: TableTypes;
  createTableElement(rows: number, cols: number): QuadratsElement[];
  insertTable(editor: T, rows: number, cols: number): void;
  moveToNextCell(editor: Editor, types: TableTypes): void;
  // 檢查選取範圍
  isSelectionInTableMain(editor: T): boolean;
  isSelectionInTableCell(editor: T): boolean;
  isSelectionInTableRow(editor: T): boolean;
  isSelectionInTableHeader(editor: T): boolean;
  isSelectionInTableBody(editor: T): boolean;
  isSelectionInTableList(editor: T): boolean;
}
