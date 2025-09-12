import { Editor } from '@quadrats/core';
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
import { Dispatch, SetStateAction } from 'react';

export type TableHeaderContextType = {
  isHeader: boolean;
};

export type TableContextType = {
  tableElement: TableElement;
  columnCount: number;
  rowCount: number;
  // Table structure manipulation
  addColumn: (options?: { position?: 'left' | 'right'; columnIndex?: number }) => void;
  addRow: (options?: { position?: 'top' | 'bottom'; rowIndex?: number }) => void;
  addColumnAndRow: VoidFunction;
  deleteRow: (rowIndex: number) => void;
  deleteColumn: (columnIndex: number) => void;
  // Maximum limits status
  isReachMaximumColumns: boolean;
  isReachMaximumRows: boolean;
  // Selection state
  tableSelectedOn:
    | {
        region: 'table' | 'header' | 'row' | 'column';
        index?: number;
      }
    | undefined;
  setTableSelectedOn: Dispatch<SetStateAction<TableContextType['tableSelectedOn']>>;
  // Hover state
  tableHoveredOn:
    | {
        columnIndex: number;
        rowIndex: number;
      }
    | undefined;
  setTableHoveredOn: Dispatch<SetStateAction<TableContextType['tableHoveredOn']>>;
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
