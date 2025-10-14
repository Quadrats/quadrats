import {
  TableElement,
  TableTypeKey,
  TableTitleTypeKey,
  TableMainTypeKey,
  TableHeaderTypeKey,
  TableBodyTypeKey,
  TableRowTypeKey,
  TableCellTypeKey,
  ColumnWidth,
} from '@quadrats/common/table';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { RefObject } from 'react';

export type JsxSerializeTableElementProps = JsxSerializeElementProps<TableElement>;

export type TableJsxSerializeElements = Record<
  TableTypeKey,
  (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined
> &
  Record<TableTitleTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<
    TableMainTypeKey,
    (props: JsxSerializeTableElementProps & { columnWidths?: ColumnWidth[] }) => JSX.Element | null | undefined
  > &
  Record<TableHeaderTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableBodyTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableRowTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<
    TableCellTypeKey,
    (props: JsxSerializeTableElementProps & { isColumnPinned?: boolean }) => JSX.Element | null | undefined
  >;

export type TableScrollContextType = {
  scrollRef: RefObject<HTMLDivElement | null>;
};
