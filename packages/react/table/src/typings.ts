import { Editor, Node } from '@quadrats/core';
import {
  Table,
  TableElement,
  TableTypeKey,
  TableTitleTypeKey,
  TableMainTypeKey,
  TableHeaderTypeKey,
  TableRowTypeKey,
  TableCellTypeKey,
  TableBodyTypeKey,
} from '@quadrats/common/table';
import { WithCreateHandlers, WithCreateRenderElement, RenderElementProps } from '@quadrats/react';
import { Table as TanStackTable, Row, Cell, ColumnDef } from '@tanstack/react-table';
import { Dispatch, SetStateAction } from 'react';

export type TableRowData = {
  [key: string]: any;
  _rowIndex: number;
  _isHeader?: boolean;
  _slateNode?: Node;
};

export type CellPosition = {
  rowIndex: number;
  columnIndex: number;
  columnId: string;
  isHeader: boolean;
  cellId: string;
};

export type RowPosition = {
  rowIndex: number;
  isHeader: boolean;
  rowId: string;
};

export type TableContextType = {
  table: TanStackTable<TableRowData>;
  tableElement: TableElement;
  columnCount: number;
  rowCount: number;
  columns: ColumnDef<TableRowData>[];
  data: TableRowData[];
  // Helper functions to get position info
  getCellPosition: (element: Node) => CellPosition | null;
  getRowPosition: (element: Node) => RowPosition | null;
  // Data manipulation functions
  updateCellData: (rowIndex: number, columnId: string, value: any) => void;
  getCellData: (rowIndex: number, columnId: string) => any;
  // Table structure manipulation
  addColumn: VoidFunction;
  addRow: VoidFunction;
  addColumnAndRow: VoidFunction;
  // Maximum limits status
  isReachMaximumColumns: boolean;
  isReachMaximumRows: boolean;
  // Selection state
  tableSelectedOn: 'table' | 'header' | 'row' | 'column' | undefined;
  setTableSelectedOn: Dispatch<SetStateAction<TableContextType['tableSelectedOn']>>;
  // TanStack Table utilities
  getRowById: (rowId: string) => Row<TableRowData> | undefined;
  getCellById: (rowId: string, columnId: string) => Cell<TableRowData, any> | undefined;
};

export type RenderTableElementProps = RenderElementProps<TableElement>;

export type TableRenderElements = Record<
  TableTypeKey,
  (props: {
    attributes?: RenderElementProps['attributes'];
    children: RenderElementProps['children'];
    element: RenderTableElementProps['element'];
  }) => JSX.Element | null | undefined
> &
  Record<
    TableTitleTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  > &
  Record<
    TableMainTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  > &
  Record<
    TableHeaderTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  > &
  Record<
    TableBodyTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  > &
  Record<
    TableRowTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  > &
  Record<
    TableCellTypeKey,
    (props: {
      attributes?: RenderElementProps['attributes'];
      children: RenderElementProps['children'];
      element: RenderElementProps['element'];
    }) => JSX.Element | null | undefined
  >;

export type ReactTableCreateRenderElementOptions = {
  [K in
    | TableTypeKey
    | TableTitleTypeKey
    | TableMainTypeKey
    | TableHeaderTypeKey
    | TableBodyTypeKey
    | TableRowTypeKey
    | TableCellTypeKey]?: TableRenderElements[K];
};

export interface ReactTable
  extends Table<Editor>,
    WithCreateHandlers,
    WithCreateRenderElement<[ReactTableCreateRenderElementOptions?]> {}
