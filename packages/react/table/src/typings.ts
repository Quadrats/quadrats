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
import { WithCreateHandlers, WithCreateRenderElement, RenderElementProps, ReactWithable } from '@quadrats/react';
import { Dispatch, SetStateAction, RefObject } from 'react';

export type TableHeaderContextType = {
  isHeader: boolean;
};

export type TableContextType = {
  tableElement: TableElement;
  columnCount: number;
  rowCount: number;
  // Portal container for toolbar positioning
  portalContainerRef: RefObject<HTMLDivElement | null>;
  // Precomputed pinned columns/rows
  pinnedColumns: Set<number>;
  pinnedRows: Set<number>;
  // Precomputed cell positions
  cellPositions: Map<TableElement, { columnIndex: number; rowIndex: number }>;
  // Table structure manipulation
  addColumn: (options?: { position?: 'left' | 'right'; columnIndex?: number }) => void;
  addRow: (options?: { position?: 'top' | 'bottom'; rowIndex?: number }) => void;
  addColumnAndRow: VoidFunction;
  deleteRow: (rowIndex: number) => void;
  deleteColumn: (columnIndex: number) => void;
  moveRowToBody: (rowIndex: number) => void;
  moveRowToHeader: (rowIndex: number, customProps?: Pick<TableElement, 'pinned'>) => void;
  unsetColumnAsTitle: (columnIndex: number) => void;
  setColumnAsTitle: (columnIndex: number, customProps?: Pick<TableElement, 'pinned'>) => void;
  pinColumn: (columnIndex: number) => void;
  unpinColumn: () => void;
  pinRow: (rowIndex: number) => void;
  unpinRow: () => void;
  swapRow: (rowIndex: number, direction: 'up' | 'down') => void;
  swapColumn: (columnIndex: number, direction: 'left' | 'right') => void;
  swapCell: (rowIndex: number, columnIndex: number, direction: 'up' | 'down' | 'left' | 'right') => void;
  // Helper functions to check pin status
  isColumnPinned: (columnIndex: number) => boolean;
  isRowPinned: (rowIndex: number) => boolean;
  // Maximum limits status
  isReachMaximumColumns: boolean;
  isReachMaximumRows: boolean;
  isReachMinimumNormalColumns: boolean;
  isReachMinimumBodyRows: boolean;
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

export type TableScrollContextType = {
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollTop: number;
  scrollLeft: number;
};

export type RenderTableElementProps = RenderElementProps<TableElement>;

export type TableRenderElements = Record<
  TableTypeKey,
  (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined
> &
  Record<TableTitleTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined> &
  Record<TableMainTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined> &
  Record<TableHeaderTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined> &
  Record<TableBodyTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined> &
  Record<TableRowTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined> &
  Record<TableCellTypeKey, (props: RenderElementProps<TableElement>) => JSX.Element | null | undefined>;

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
  extends Omit<Table<Editor>, 'with'>,
    WithCreateHandlers,
    WithCreateRenderElement<[ReactTableCreateRenderElementOptions?]>,
    ReactWithable {}
