/* eslint-disable @typescript-eslint/naming-convention */
import { WithElementParent } from '@quadrats/core/serializers';
import {
  TableElement,
  TableTypeKey,
  TableTitleTypeKey,
  TableMainTypeKey,
  TableHeaderTypeKey,
  TableBodyTypeKey,
  TableRowTypeKey,
  TableCellTypeKey,
  TABLE_TYPES,
} from '@quadrats/common/table';
import {
  CreateJsxSerializeElementOptions,
  createJsxSerializeElements,
  JsxSerializeElementProps,
} from '@quadrats/react/jsx-serializer';
import { defaultRenderTableElements } from './defaultRenderTableElements';
import { JsxSerializeTableElementProps } from './typings';

export type CreateJsxSerializeTableOptions = Partial<
  Record<TableTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeTableElementProps>>> &
    Record<TableTitleTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
    Record<TableMainTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
    Record<TableHeaderTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
    Record<TableBodyTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
    Record<TableRowTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
    Record<TableCellTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>>
>;

export function createJsxSerializeTable(options: CreateJsxSerializeTableOptions = {}) {
  const {
    table = {},
    table_title = {},
    table_main = {},
    table_header = {},
    table_body = {},
    table_row = {},
    table_cell = {},
  } = options;

  const tableType = table.type || TABLE_TYPES.table;
  const tableTitleType = table_title.type || TABLE_TYPES.table_title;
  const tableMainType = table_main.type || TABLE_TYPES.table_main;
  const tableHeaderType = table_header.type || TABLE_TYPES.table_header;
  const tableBodyType = table_body.type || TABLE_TYPES.table_body;
  const tableRowType = table_row.type || TABLE_TYPES.table_row;
  const tableCellType = table_cell.type || TABLE_TYPES.table_cell;

  const renderTable = table.render || defaultRenderTableElements.table;
  const renderTableTitle = table_title.render || defaultRenderTableElements.table_title;
  const renderTableMain = table_main.render || defaultRenderTableElements.table_main;
  const renderTableHeader = table_header.render || defaultRenderTableElements.table_header;
  const renderTableBody = table_body.render || defaultRenderTableElements.table_body;
  const renderTableRow = table_row.render || defaultRenderTableElements.table_row;
  const renderTableCell = table_cell.render || defaultRenderTableElements.table_cell;

  return createJsxSerializeElements([
    {
      type: tableType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTable({
          children,
          element,
        });
      },
    },
    {
      type: tableTitleType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableTitle({
          children,
          element,
        });
      },
    },
    {
      type: tableMainType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableMain({
          children,
          element,
        });
      },
    },
    {
      type: tableHeaderType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableHeader({
          children,
          element,
        });
      },
    },
    {
      type: tableBodyType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableBody({
          children,
          element,
        });
      },
    },
    {
      type: tableRowType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableRow({
          children,
          element,
        });
      },
    },
    {
      type: tableCellType,
      render: (props) => {
        const { children } = props;
        const element = props.element as TableElement & WithElementParent;

        return renderTableCell({
          children,
          element,
        });
      },
    },
  ]);
}
