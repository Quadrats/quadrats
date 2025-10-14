import { createTable, CreateTableOptions, TableElement } from '@quadrats/common/table';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { Editor, Element, PARAGRAPH_TYPE, Text, Transforms } from '@quadrats/core';
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
            if (core.isSelectionInTableList(editor)) {
              return next();
            }

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

          // 處理方向鍵上下移動
          if (event.key === 'ArrowUp') {
            event.preventDefault();

            if (event.shiftKey) {
              // Shift + 上：擴展選取範圍
              core.extendSelectionUp(editor, types);
            } else {
              // 只按上：移動到上一行
              core.moveToRowAbove(editor, types);
            }

            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();

            if (event.shiftKey) {
              // Shift + 下：擴展選取範圍
              core.extendSelectionDown(editor, types);
            } else {
              // 只按下：移動到下一行
              core.moveToRowBelow(editor, types);
            }

            return;
          }

          if (event.key === 'ArrowLeft') {
            // Shift + 左：擴展選取範圍
            if (event.shiftKey) {
              event.preventDefault();
              core.extendSelectionLeft(editor, types);

              return;
            }
          }

          if (event.key === 'ArrowRight') {
            // Shift + 右：擴展選取範圍
            if (event.shiftKey) {
              event.preventDefault();
              core.extendSelectionRight(editor, types);

              return;
            }
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
    with(editor) {
      const { insertData } = editor;

      /** 從他處複製文字貼過來時觸發 */
      editor.insertData = (data) => {
        const { selection } = editor;

        if (!selection) {
          insertData(data);

          return;
        }

        // 先檢查選取的起點是否在 table cell 中
        const cellEntry = Editor.above(editor, {
          at: selection.anchor,
          match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_cell,
        });

        if (cellEntry) {
          // 確認在 table 內，將選取範圍縮減到起點
          Transforms.collapse(editor, { edge: 'start' });

          // 重新取得 cell entry（使用當前游標位置）
          const targetCellEntry = Editor.above(editor, {
            match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_cell,
          });

          if (!targetCellEntry) {
            insertData(data);

            return;
          }

          const [, cellPath] = targetCellEntry;

          // 從剪貼簿取得純文字
          const text = data.getData('text/plain');

          if (text) {
            // 檢測是否為表格格式（包含 Tab 或換行）
            const hasTableFormat = text.includes('\t') || text.includes('\n');

            if (hasTableFormat) {
              // 解析表格格式：行由 \n 分隔，欄位由 \t 分隔
              const rows = text.split('\n').filter((row: string) => row.length > 0);

              if (rows.length === 0) {
                return;
              }

              // 找到當前 cell 所在的 row 和 column index
              const rowEntry = Editor.above(editor, {
                at: cellPath,
                match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_row,
              });

              if (!rowEntry) {
                // 如果找不到 row，降級為純文字插入
                Transforms.insertText(editor, text.replace(/\t/g, ' '));

                return;
              }

              const [, rowPath] = rowEntry;
              const currentColumnIndex = cellPath[cellPath.length - 1];

              // 找到 table body 或 header
              const containerEntry = Editor.above(editor, {
                at: rowPath,
                match: (n) =>
                  Element.isElement(n) &&
                  ((n as TableElement).type === types.table_body || (n as TableElement).type === types.table_header),
              });

              if (!containerEntry) {
                // 降級為純文字插入
                Transforms.insertText(editor, text.replace(/\t/g, ' '));

                return;
              }

              const [container, containerPath] = containerEntry;
              const currentRowIndex = rowPath[rowPath.length - 1];

              // 使用 Editor.withoutNormalizing 批次處理
              Editor.withoutNormalizing(editor, () => {
                rows.forEach((rowText: string, rowOffset: number) => {
                  const columns = rowText.split('\t');
                  const targetRowIndex = currentRowIndex + rowOffset;

                  // 檢查目標 row 是否存在
                  if (targetRowIndex >= container.children.length) {
                    return; // 超出範圍，跳過此行
                  }

                  const targetRow = container.children[targetRowIndex];

                  if (!Element.isElement(targetRow) || (targetRow as TableElement).type !== types.table_row) {
                    return;
                  }

                  // 貼上到各個 cell
                  columns.forEach((columnText: string, columnOffset: number) => {
                    const targetColumnIndex = currentColumnIndex + columnOffset;

                    // 檢查目標 cell 是否存在
                    if (targetColumnIndex >= targetRow.children.length) {
                      return; // 超出範圍，跳過此欄
                    }

                    const targetCellPath = [...containerPath, targetRowIndex, targetColumnIndex];

                    // 清空目標 cell 的內容
                    const targetCell = targetRow.children[targetColumnIndex];

                    if (Element.isElement(targetCell) && (targetCell as TableElement).type === types.table_cell) {
                      // 移除所有子節點
                      for (let i = targetCell.children.length - 1; i >= 0; i--) {
                        Transforms.removeNodes(editor, { at: [...targetCellPath, i] });
                      }

                      // 插入新內容
                      Transforms.insertNodes(
                        editor,
                        {
                          type: PARAGRAPH_TYPE,
                          children: [{ text: columnText }],
                        },
                        { at: [...targetCellPath, 0] },
                      );
                    }
                  });
                });
              });

              return;
            }
          }
        }

        // 預設行為
        insertData(data);
      };

      return core.with(editor);
    },
  };
}
