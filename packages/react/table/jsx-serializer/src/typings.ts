import {
  TableElement,
  TableTypeKey,
  TableTitleTypeKey,
  TableMainTypeKey,
  TableHeaderTypeKey,
  TableBodyTypeKey,
  TableRowTypeKey,
  TableCellTypeKey,
} from '@quadrats/common/table';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export type JsxSerializeTableElementProps = JsxSerializeElementProps<TableElement>;

export type TableJsxSerializeElements = Record<
  TableTypeKey,
  (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined
> &
  Record<TableTitleTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableMainTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableHeaderTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableBodyTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableRowTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined> &
  Record<TableCellTypeKey, (props: JsxSerializeTableElementProps) => JSX.Element | null | undefined>;
