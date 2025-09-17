import { createTable, CreateTableOptions, TableElement } from '@quadrats/common/table';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { Editor, Element, Text } from '@quadrats/core';
import { defaultRenderTableElements } from './defaultRenderTableElements';
import { ReactTable } from './typings';

export type CreateReactTableOptions = CreateTableOptions;

export function createReactTable(options: CreateReactTableOptions = {}): ReactTable {
  const core = createTable(options);
  const { types } = core;

  return {
    ...core,
    createHandlers: () => ({
      onKeyDown(event, editor, next) {
        if (event.nativeEvent.isComposing) {
          return;
        }

        if (core.isSelectionInTableCell(editor)) {
          const checkCurrentCellHasContent = () => {
            if (!editor.selection) return false;

            const [cellNode] = Editor.node(editor, editor.selection);

            if (Text.isText(cellNode)) {
              return cellNode.text.trim() !== '';
            }

            if (!Element.isElement(cellNode)) return false;

            const hasContent = cellNode.children.some((child) => {
              if (Text.isText(child)) {
                return child.text.trim() !== '';
              }

              return Element.isElement(child);
            });

            return hasContent;
          };

          if (event.key === 'Enter') {
            event.preventDefault();

            const currentCellHasContent = checkCurrentCellHasContent();

            if (currentCellHasContent) {
              // Insert soft break
              Editor.insertText(editor, '\n');
            } else {
              // Move to next cell
              core.moveToNextCell(editor, types);
            }

            return;
          }

          if (event.key === 'Tab') {
            event.preventDefault();
            // shift+tab
            if (event.shiftKey) return;

            core.moveToNextCell(editor, types);

            return;
          }
        }

        next();
      },
    }),
    createRenderElement: (options = {}) => {
      const renderTable = options.table || defaultRenderTableElements.table;
      const renderTableTitle = options.table_title || defaultRenderTableElements.table_title;
      const renderTableMain = options.table_main || defaultRenderTableElements.table_main;
      const renderTableHeader = options.table_header || defaultRenderTableElements.table_header;
      const renderTableBody = options.table_body || defaultRenderTableElements.table_body;
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
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

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
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

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
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

            return renderTableHeader({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_body,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

            return renderTableBody({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.table_row,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

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
            const { attributes, children, element } = props as RenderElementProps<TableElement>;

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
