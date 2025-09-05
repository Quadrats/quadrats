import { createTable, CreateTableOptions, TableElement } from '@quadrats/common/table';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { defaultRenderTableElements } from './defaultRenderTableElements';
import { ReactTable } from './typings';

export type CreateReactTableOptions = CreateTableOptions;

export function createReactTable(options: CreateReactTableOptions = {}): ReactTable {
  const core = createTable(options);
  const { types } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown(event, _editor, next) {
        if (event.nativeEvent.isComposing) {
          return;
        }

        // Handle table-specific keyboard events here
        // For now, delegate to next handler
        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderTable = options.table || defaultRenderTableElements.table;
      const renderTableTitle = options.table_title || defaultRenderTableElements.table_title;
      const renderTableMain = options.table_main || defaultRenderTableElements.table_main;
      const renderTableHeader = options.table_header || defaultRenderTableElements.table_header;
      const renderTableRow = options.table_row || defaultRenderTableElements.table_row;
      const renderTableCell = options.table_cell || defaultRenderTableElements.table_cell;

      return createRenderElements([
        {
          type: types.table,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

            return renderTable({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_title,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderTableTitle({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_main,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderTableMain({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_header,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderTableHeader({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_row,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderTableRow({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_cell,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderTableCell({
              attributes,
              element,
              children,
            });
          },
        },
      ]);
    },
  };
}
