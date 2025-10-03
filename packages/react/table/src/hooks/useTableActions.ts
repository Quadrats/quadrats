import { useCallback } from 'react';
import { Element, Transforms, Editor } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { RenderTableElementProps, TableContextType } from '../typings';
import {
  TABLE_CELL_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_DEFAULT_MAX_COLUMNS,
  TABLE_ROW_TYPE,
  TableElement,
} from '@quadrats/common/table';
import { useQuadrats } from '@quadrats/react';
import {
  getTableStructure,
  createTableCell,
  getReferenceRowFromHeaderOrBody,
  hasAnyPinnedRows,
  hasAnyPinnedColumns,
  getColumnWidths,
  calculateColumnWidthsAfterAdd,
  calculateColumnWidthsAfterDelete,
  setColumnWidths,
  moveColumnWidth,
  convertToMixedWidthMode,
  getPinnedColumnsInfo,
} from '../utils/helper';

export function useTableActions(element: RenderTableElementProps['element']) {
  const editor = useQuadrats();

  const isColumnPinned: TableContextType['isColumnPinned'] = useCallback(
    (columnIndex) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return false;

        const { tableMainElement } = tableStructure;

        if (!tableMainElement) return false;

        for (const container of tableMainElement.children) {
          if (!Element.isElement(container)) continue;

          for (const row of container.children) {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cell = row.children[columnIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                // 如果有任何一個 cell 沒有 pinned 屬性，則整個 column 不算 pinned
                if (!cell.pinned) {
                  return false;
                }
              }
            }
          }
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [element, editor],
  );

  const isRowPinned: TableContextType['isRowPinned'] = useCallback(
    (rowIndex) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return false;

        const { tableHeaderElement, tableBodyElement } = tableStructure;

        const headerRowCount =
          tableHeaderElement && Element.isElement(tableHeaderElement) ? tableHeaderElement.children.length : 0;

        let targetRow: TableElement | undefined;

        if (rowIndex < headerRowCount && tableHeaderElement && Element.isElement(tableHeaderElement)) {
          // 在 Header 中
          const rowElement = tableHeaderElement.children[rowIndex];

          if (Element.isElement(rowElement)) {
            targetRow = rowElement as TableElement;
          }
        } else if (tableBodyElement && Element.isElement(tableBodyElement)) {
          // 在 Body 中
          const bodyRowIndex = rowIndex - headerRowCount;
          const rowElement = tableBodyElement.children[bodyRowIndex];

          if (Element.isElement(rowElement)) {
            targetRow = rowElement as TableElement;
          }
        }

        if (!Element.isElement(targetRow) || !targetRow.type.includes(TABLE_ROW_TYPE)) {
          return false;
        }

        // 檢查所有 cell 是否都有 pinned 屬性
        for (const cell of targetRow.children) {
          if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
            if (!(cell as TableElement).pinned) {
              return false;
            }
          }
        }

        return true;
      } catch (error) {
        return false;
      }
    },
    [element, editor],
  );

  const addColumn: TableContextType['addColumn'] = useCallback(
    (options = {}) => {
      const { position = 'right', columnIndex } = options;

      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableHeaderPath, tableBodyPath, columnCount } = tableStructure;

        if (columnCount >= TABLE_DEFAULT_MAX_COLUMNS) {
          console.warn(`Maximum columns limit (${TABLE_DEFAULT_MAX_COLUMNS}) reached`);

          return;
        }

        // 計算插入位置
        let insertIndex: number;

        if (typeof columnIndex === 'number') {
          insertIndex = position === 'left' ? Math.max(0, columnIndex) : Math.min(columnCount, columnIndex + 1);
        } else {
          insertIndex = columnCount;
        }

        // 使用 Editor.withoutNormalizing 來批次執行所有操作
        Editor.withoutNormalizing(editor, () => {
          // 在 Header 中加入 cell
          if (tableHeaderElement && tableHeaderPath) {
            tableHeaderElement.children.forEach((row, rowIndex) => {
              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const referenceCell = row.children[insertIndex - (position === 'left' ? 0 : 1)] as TableElement;
                const newCell = createTableCell(referenceCell);
                const cellPath = [...tableHeaderPath, rowIndex, insertIndex];

                Transforms.insertNodes(editor, newCell, { at: cellPath });
              }
            });
          }

          // 在 Body 中加入 cell
          tableBodyElement!.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const referenceCell = row.children[insertIndex - (position === 'left' ? 0 : 1)] as TableElement;
              const newCell = createTableCell(referenceCell);
              const cellPath = [...tableBodyPath, rowIndex, insertIndex];

              Transforms.insertNodes(editor, newCell, { at: cellPath });
            }
          });

          // 調整欄位寬度
          const currentWidths = getColumnWidths(element);

          if (currentWidths.length > 0) {
            const newWidths = calculateColumnWidthsAfterAdd(currentWidths, insertIndex);

            setColumnWidths(editor, element, newWidths);
          }
        });
      } catch (error) {
        console.warn('Failed to add column:', error);
      }
    },
    [editor, element],
  );

  const addRow: TableContextType['addRow'] = useCallback(
    (options = {}) => {
      const { position = 'bottom', rowIndex } = options;

      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableHeaderPath, tableBodyPath, headerRowCount, columnCount } =
          tableStructure;

        // 計算插入位置和參考行
        let insertIndex: number;
        let referenceRowElement: Element | undefined;
        let targetPath: number[];

        if (typeof rowIndex === 'number') {
          // 檢查是在 Header / Body 之中
          if (tableHeaderElement && rowIndex < headerRowCount) {
            targetPath = tableHeaderPath!;

            if (position === 'top') {
              insertIndex = Math.max(0, rowIndex);
              referenceRowElement = getReferenceRowFromHeaderOrBody(tableHeaderElement, insertIndex);
            } else {
              insertIndex = Math.min(headerRowCount, rowIndex + 1);
              referenceRowElement = getReferenceRowFromHeaderOrBody(tableHeaderElement, rowIndex);
            }
          } else {
            targetPath = tableBodyPath;
            const bodyRowIndex = rowIndex - headerRowCount;

            if (position === 'top') {
              insertIndex = Math.max(0, bodyRowIndex);
              referenceRowElement = getReferenceRowFromHeaderOrBody(tableBodyElement!, insertIndex);
            } else {
              insertIndex = Math.min(tableBodyElement!.children.length, bodyRowIndex + 1);
              referenceRowElement = getReferenceRowFromHeaderOrBody(tableBodyElement!, bodyRowIndex);
            }
          }
        } else {
          // 預設：在 Body 尾端加入列
          targetPath = tableBodyPath;
          insertIndex = tableBodyElement!.children.length;
          referenceRowElement = getReferenceRowFromHeaderOrBody(tableBodyElement!, insertIndex - 1);
        }

        // 創建新行
        const newRow: TableElement = {
          type: TABLE_ROW_TYPE,
          children: Array.from({ length: columnCount }, (_, cellIndex) => {
            let referenceCell: TableElement | undefined;

            if (referenceRowElement && referenceRowElement.children[cellIndex]) {
              const cell = referenceRowElement.children[cellIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                referenceCell = cell as TableElement;
              }
            }

            return createTableCell(referenceCell);
          }),
        };

        // 插入新行
        const newRowPath = [...targetPath, insertIndex];

        Transforms.insertNodes(editor, newRow, { at: newRowPath });
      } catch (error) {
        console.warn('Failed to add row:', error);
      }
    },
    [editor, element],
  );

  const addColumnAndRow: TableContextType['addColumnAndRow'] = useCallback(() => {
    try {
      const tableStructure = getTableStructure(editor, element);

      if (!tableStructure) return;

      const { tableHeaderElement, tableBodyElement, tableHeaderPath, tableBodyPath, columnCount } = tableStructure;

      if (columnCount >= TABLE_DEFAULT_MAX_COLUMNS) {
        console.warn(`Maximum columns limit (${TABLE_DEFAULT_MAX_COLUMNS}) reached`);

        return;
      }

      editor.withoutNormalizing(() => {
        // 在 Header 中加入新列
        if (tableHeaderElement && tableHeaderPath) {
          tableHeaderElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const lastCell = row.children[row.children.length - 1] as TableElement;
              const newHeaderCell = createTableCell(lastCell);

              const cellPath = [...tableHeaderPath, rowIndex, row.children.length];

              Transforms.insertNodes(editor, newHeaderCell, { at: cellPath });
            }
          });
        }

        // 在 Body 中加入新列
        tableBodyElement!.children.forEach((row, rowIndex) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            const lastCell = row.children[row.children.length - 1] as TableElement;
            const newCell = createTableCell(lastCell);

            const cellPath = [...tableBodyPath, rowIndex, row.children.length];

            Transforms.insertNodes(editor, newCell, { at: cellPath });
          }
        });

        // 加入新行
        const newColumnCount = columnCount + 1;
        const lastRow = getReferenceRowFromHeaderOrBody(tableBodyElement!, tableBodyElement!.children.length - 1);

        const newRow: TableElement = {
          type: TABLE_ROW_TYPE,
          children: Array.from({ length: newColumnCount }, (_, cellIndex) => {
            let referenceCell: TableElement | undefined;

            if (cellIndex < newColumnCount - 1 && Element.isElement(lastRow) && lastRow.type.includes(TABLE_ROW_TYPE)) {
              const cell = lastRow.children[cellIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                referenceCell = cell as TableElement;
              }
            } else {
              if (Element.isElement(lastRow) && lastRow.type.includes(TABLE_ROW_TYPE)) {
                const cell = lastRow.children[lastRow.children.length - 1];

                if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                  referenceCell = cell as TableElement;
                }
              }
            }

            return createTableCell(referenceCell);
          }),
        };

        const newRowPath = [...tableBodyPath, tableBodyElement!.children.length];

        Transforms.insertNodes(editor, newRow, { at: newRowPath });
      });
    } catch (error) {
      console.warn('Failed to add column and row:', error);
    }
  }, [editor, element]);

  const deleteRow: TableContextType['deleteRow'] = useCallback(
    (rowIndex) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableHeaderPath, tableBodyPath, headerRowCount } = tableStructure;

        // 檢查是否刪除 Header 行
        if (rowIndex < headerRowCount) {
          if (!tableHeaderElement || !tableHeaderPath) return;

          const headerRowPath = [...tableHeaderPath, rowIndex];

          Transforms.removeNodes(editor, { at: headerRowPath });

          // 如果是最後一個 header 行，移除整個 header 元素
          if (headerRowCount <= 1) {
            Transforms.removeNodes(editor, { at: tableHeaderPath });
          }

          return;
        }

        // 刪除 Body 行
        const bodyRowIndex = rowIndex - headerRowCount;

        if (bodyRowIndex < 0 || bodyRowIndex >= tableBodyElement!.children.length) {
          console.warn('Invalid row index for deletion');

          return;
        }

        if (tableBodyElement!.children.length <= 1) {
          console.warn('Cannot delete the last row');

          return;
        }

        const rowPath = [...tableBodyPath, bodyRowIndex];

        Transforms.removeNodes(editor, { at: rowPath });
      } catch (error) {
        console.warn('Failed to delete row:', error);
      }
    },
    [editor, element],
  );

  const deleteColumn: TableContextType['deleteColumn'] = useCallback(
    (columnIndex) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableHeaderPath, tableBodyPath, columnCount } = tableStructure;

        // 檢查是否有足夠的列（不允許刪除最後一列）
        if (columnCount <= 1) {
          console.warn('Cannot delete the last column');

          return;
        }

        // 檢查 columnIndex 是否有效
        if (columnIndex < 0 || columnIndex >= columnCount) {
          console.warn('Invalid column index for deletion');

          return;
        }

        editor.withoutNormalizing(() => {
          // 從 Header 中刪除列
          if (tableHeaderElement && tableHeaderPath) {
            // 以反向順序刪除
            for (let rowIndex = tableHeaderElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const headerRow = tableHeaderElement.children[rowIndex];

              if (Element.isElement(headerRow) && headerRow.type.includes(TABLE_ROW_TYPE)) {
                const headerCellPath = [...tableHeaderPath, rowIndex, columnIndex];

                Transforms.removeNodes(editor, { at: headerCellPath });
              }
            }
          }

          // 從 Body 中刪除列
          for (let rowIndex = tableBodyElement!.children.length - 1; rowIndex >= 0; rowIndex--) {
            const row = tableBodyElement!.children[rowIndex];

            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cellPath = [...tableBodyPath, rowIndex, columnIndex];

              Transforms.removeNodes(editor, { at: cellPath });
            }
          }

          // 調整欄位寬度
          const currentWidths = getColumnWidths(element);

          if (currentWidths.length > 0) {
            const newWidths = calculateColumnWidthsAfterDelete(currentWidths, columnIndex);

            setColumnWidths(editor, element, newWidths);
          }
        });
      } catch (error) {
        console.warn('Failed to delete column:', error);
      }
    },
    [editor, element],
  );

  const moveRowToBody: TableContextType['moveRowToBody'] = useCallback(
    (rowIndex: number) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableHeaderPath, tableBodyPath } = tableStructure;

        if (!tableHeaderElement || !tableHeaderPath) return;

        // 檢查行是否存在於 header 中
        if (rowIndex >= tableHeaderElement.children.length) {
          console.warn('Invalid header row index:', rowIndex);

          return;
        }

        const rowToMove = tableHeaderElement.children[rowIndex];

        if (!Element.isElement(rowToMove) || !rowToMove.type.includes(TABLE_ROW_TYPE)) return;

        const rowPath = [...tableHeaderPath, rowIndex];

        // 移動前移除所有 cell 的 pinned 屬性
        rowToMove.children.forEach((cell, columnIndex) => {
          if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && (cell as TableElement).pinned) {
            if (cell.pinned && isColumnPinned(columnIndex)) {
              const cellPath = [...rowPath, columnIndex];

              Transforms.unsetNodes(editor, 'pinned', { at: cellPath });
            }
          }
        });

        // 移動行到 body 的開始位置
        const bodyTargetPath = [...tableBodyPath, 0];

        Transforms.moveNodes(editor, {
          at: rowPath,
          to: bodyTargetPath,
        });
      } catch (error) {
        console.warn('Failed to move row to body:', error);
      }
    },
    [editor, element, isColumnPinned],
  );

  const moveRowToHeader: TableContextType['moveRowToHeader'] = useCallback(
    (rowIndex: number, customProps?: Pick<TableElement, 'pinned'>) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableMainPath, tableHeaderPath, tableBodyPath, headerRowCount } =
          tableStructure;

        // 計算正確的 body 行索引
        const bodyRowIndex = rowIndex - headerRowCount;

        // 檢查 body 行索引是否有效
        if (bodyRowIndex < 0 || bodyRowIndex >= tableBodyElement!.children.length) {
          console.warn('Invalid body row index:', bodyRowIndex);

          return;
        }

        // 檢查行是否存在
        const rowToMove = tableBodyElement!.children[bodyRowIndex];

        if (!Element.isElement(rowToMove) || !rowToMove.type.includes(TABLE_ROW_TYPE)) return;

        // 檢查 header 中是否已有 pinned rows（一致性規則檢查）
        const hasExistingPinnedRows = tableStructure ? hasAnyPinnedRows(tableStructure) : false;

        // 如果有現有的 pinned rows 且沒有提供自定義屬性，自動設置 pinned 以保持一致性
        const finalProps = customProps || (hasExistingPinnedRows ? { pinned: true } : undefined);

        // 如果提供了 finalProps，則應用到 cells
        const processedRow = finalProps
          ? {
              ...rowToMove,
              children: rowToMove.children.map((cell) => {
                if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                  return {
                    ...cell,
                    ...finalProps,
                  } as TableElement;
                }

                return cell;
              }),
            }
          : rowToMove;

        const rowPath = [...tableBodyPath, bodyRowIndex];

        // 如果 header 不存在，先創建它
        if (!tableHeaderElement) {
          const newHeader = {
            type: TABLE_HEADER_TYPE,
            children: [processedRow],
          };

          const headerInsertPath = [...tableMainPath, 0];

          Editor.withoutNormalizing(editor, () => {
            Transforms.removeNodes(editor, { at: rowPath });
            Transforms.insertNodes(editor, newHeader, { at: headerInsertPath });
          });
        } else {
          // 如果這是 pinned row，找到正確的插入位置（pinned rows 在頂部）
          let headerTargetPath: number[];

          if (finalProps?.pinned) {
            let insertIndex = 0;

            for (const [index, headerRow] of tableHeaderElement.children.entries()) {
              if (Element.isElement(headerRow)) {
                const hasNonPinnedCell = headerRow.children.some(
                  (cell) => Element.isElement(cell) && !(cell as TableElement).pinned,
                );

                if (hasNonPinnedCell) {
                  break;
                }

                insertIndex = index + 1;
              }
            }

            headerTargetPath = [...tableHeaderPath!, insertIndex];

            Editor.withoutNormalizing(editor, () => {
              Transforms.removeNodes(editor, { at: rowPath });
              Transforms.insertNodes(editor, processedRow, { at: headerTargetPath });
            });
          } else {
            // 移動行到現有 header 的末尾
            headerTargetPath = [...tableHeaderPath!, tableHeaderElement.children.length];
            Transforms.moveNodes(editor, {
              at: rowPath,
              to: headerTargetPath,
            });
          }
        }
      } catch (error) {
        console.warn('Failed to move row to header:', error);
      }
    },
    [editor, element],
  );

  const unsetColumnAsTitle: TableContextType['unsetColumnAsTitle'] = useCallback(
    (columnIndex: number) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableMainElement } = tableStructure;

        // 獲取 table 的實際寬度（用於轉換為混合模式）
        let tableWidth = 0;

        try {
          if (tableMainElement) {
            const tableDOMElement = ReactEditor.toDOMNode(editor, tableMainElement);

            if (tableDOMElement instanceof HTMLElement) {
              tableWidth = tableDOMElement.getBoundingClientRect().width;
            }
          }
        } catch (error) {
          console.warn('Failed to get table width:', error);
        }

        const processContainer = (containerElement: TableElement) => {
          if (!Element.isElement(containerElement)) return;

          const containerPath = ReactEditor.findPath(editor, containerElement);
          const firstRow = containerElement.children[0];

          // 找到 column 標題列的尾端
          let targetColumnIndex = 0;

          if (Element.isElement(firstRow) && firstRow.type.includes(TABLE_ROW_TYPE)) {
            for (let i = 0; i < firstRow.children.length; i++) {
              const cell = firstRow.children[i];

              if (
                Element.isElement(cell) &&
                cell.type.includes(TABLE_CELL_TYPE) &&
                cell.treatAsTitle &&
                i !== columnIndex
              ) {
                targetColumnIndex = i + 1;
              }
            }
          }

          containerElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cell = row.children[columnIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                const cellPath = [...containerPath, rowIndex, columnIndex];

                Transforms.unsetNodes(editor, 'treatAsTitle', { at: cellPath });

                if (cell.pinned && !isRowPinned(rowIndex)) {
                  Transforms.unsetNodes(editor, 'pinned', { at: cellPath });
                }
              }
            }
          });

          if (columnIndex < targetColumnIndex) {
            const actualTargetIndex = targetColumnIndex - 1;

            for (let rowIndex = containerElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const row = containerElement.children[rowIndex];

              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const fromPath = [...containerPath, rowIndex, columnIndex];
                const toPath = [...containerPath, rowIndex, actualTargetIndex];

                Transforms.moveNodes(editor, {
                  at: fromPath,
                  to: toPath,
                });
              }
            }

            // 調整 columnWidths：將 columnIndex 的寬度移動到 actualTargetIndex
            const currentWidths = getColumnWidths(element);

            if (currentWidths.length > 0) {
              const movedWidths = moveColumnWidth(currentWidths, columnIndex, actualTargetIndex);

              // 檢查移動後是否還有 pinned columns
              const { pinnedColumnIndices } = getPinnedColumnsInfo(element);

              // 更新釘選欄位索引（移除當前欄位，並調整其他欄位的索引）
              const updatedPinnedIndices = pinnedColumnIndices
                .filter((idx) => idx !== columnIndex)
                .map((idx) => {
                  if (idx > columnIndex && idx <= actualTargetIndex) return idx - 1;

                  return idx;
                })
                .sort((a, b) => a - b);

              // 如果還有 pinned columns，轉換為混合模式；否則可能轉回全 percentage 模式
              if (updatedPinnedIndices.length > 0 && tableWidth > 0) {
                const mixedWidths = convertToMixedWidthMode(movedWidths, updatedPinnedIndices, tableWidth);

                setColumnWidths(editor, element, mixedWidths);
              } else {
                // 沒有 pinned columns 了，使用原本的寬度
                setColumnWidths(editor, element, movedWidths);
              }
            }
          } else {
            // 即使沒有移動位置，也需要檢查是否需要更新寬度模式
            const currentWidths = getColumnWidths(element);

            if (currentWidths.length > 0) {
              const { pinnedColumnIndices } = getPinnedColumnsInfo(element);

              // 移除當前欄位
              const updatedPinnedIndices = pinnedColumnIndices
                .filter((idx) => idx !== columnIndex)
                .sort((a, b) => a - b);

              // 如果還有 pinned columns，轉換為混合模式；否則可能轉回全 percentage 模式
              if (updatedPinnedIndices.length > 0 && tableWidth > 0) {
                const mixedWidths = convertToMixedWidthMode(currentWidths, updatedPinnedIndices, tableWidth);

                setColumnWidths(editor, element, mixedWidths);
              }
              // 如果沒有 pinned columns，保持原樣（可能已經是全 percentage 了）
            }
          }
        };

        if (tableHeaderElement) {
          processContainer(tableHeaderElement);
        }

        if (tableBodyElement) {
          processContainer(tableBodyElement);
        }
      } catch (error) {
        console.warn('Failed to unset column as title:', error);
      }
    },
    [editor, element, isRowPinned],
  );

  const setColumnAsTitle: TableContextType['setColumnAsTitle'] = useCallback(
    (columnIndex: number, customProps?: Pick<TableElement, 'pinned'>) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, tableBodyElement, tableMainElement } = tableStructure;

        // 檢查是否已有 pinned columns（一致性規則檢查）
        const hasExistingPinnedColumns = hasAnyPinnedColumns(tableStructure);

        // 如果有現有的 pinned columns 且沒有提供自定義屬性，自動設置 pinned 以保持一致性
        const finalProps = customProps || (hasExistingPinnedColumns ? { pinned: true } : undefined);

        // 獲取 table 的實際寬度（用於轉換為混合模式）
        let tableWidth = 0;

        try {
          if (tableMainElement) {
            const tableDOMElement = ReactEditor.toDOMNode(editor, tableMainElement);

            if (tableDOMElement instanceof HTMLElement) {
              tableWidth = tableDOMElement.getBoundingClientRect().width;
            }
          }
        } catch (error) {
          console.warn('Failed to get table width:', error);
        }

        const processContainer = (containerElement: TableElement) => {
          if (!Element.isElement(containerElement)) return;

          const containerPath = ReactEditor.findPath(editor, containerElement);
          const firstRow = containerElement.children[0];

          // 先找到 column 標題列的尾端
          let targetColumnIndex = 0;

          if (Element.isElement(firstRow) && firstRow.type.includes(TABLE_ROW_TYPE)) {
            for (let i = 0; i < firstRow.children.length; i++) {
              const cell = firstRow.children[i];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && cell.treatAsTitle) {
                targetColumnIndex = i + 1;
              } else {
                break;
              }
            }
          }

          containerElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              row.children.forEach((cell, childColIndex) => {
                const cellPath = [...containerPath, rowIndex, childColIndex];

                if (childColIndex === columnIndex) {
                  const nodeProps = finalProps ? { treatAsTitle: true, ...finalProps } : { treatAsTitle: true };

                  Transforms.setNodes(editor, nodeProps as Partial<TableElement>, { at: cellPath });
                } else if (finalProps?.pinned) {
                  // 確保其他 title column 也有 pinned 屬性以保持一致性
                  if (Element.isElement(cell) && cell.treatAsTitle) {
                    Transforms.setNodes(editor, { pinned: true } as Partial<TableElement>, { at: cellPath });
                  }
                }
              });
            }
          });

          // 如果目標位置並不需要移動，則直接返回
          if (columnIndex < targetColumnIndex) return;

          if (columnIndex !== targetColumnIndex) {
            for (let rowIndex = containerElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const row = containerElement.children[rowIndex];

              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const fromPath = [...containerPath, rowIndex, columnIndex];
                const toPath = [...containerPath, rowIndex, targetColumnIndex];

                Transforms.moveNodes(editor, {
                  at: fromPath,
                  to: toPath,
                });
              }
            }

            // 調整 columnWidths：將 columnIndex 的寬度移動到 targetColumnIndex
            const currentWidths = getColumnWidths(element);

            if (currentWidths.length > 0) {
              const movedWidths = moveColumnWidth(currentWidths, columnIndex, targetColumnIndex);

              // 如果設定了 pinned，需要轉換為混合模式
              if (finalProps?.pinned && tableWidth > 0) {
                const { pinnedColumnIndices } = getPinnedColumnsInfo(element);

                // 更新釘選欄位索引（因為欄位已經移動了）
                const updatedPinnedIndices = pinnedColumnIndices
                  .map((idx) => {
                    if (idx === columnIndex) return targetColumnIndex;
                    if (idx >= targetColumnIndex && idx < columnIndex) return idx + 1;

                    return idx;
                  })
                  .concat(targetColumnIndex) // 加入新的釘選欄位
                  .filter((idx, i, arr) => arr.indexOf(idx) === i) // 去重
                  .sort((a, b) => a - b);

                const mixedWidths = convertToMixedWidthMode(movedWidths, updatedPinnedIndices, tableWidth);

                setColumnWidths(editor, element, mixedWidths);
              } else {
                setColumnWidths(editor, element, movedWidths);
              }
            }
          } else if (finalProps?.pinned && tableWidth > 0) {
            // 即使沒有移動位置，如果設定了 pinned，也需要轉換為混合模式
            const currentWidths = getColumnWidths(element);

            if (currentWidths.length > 0) {
              const { pinnedColumnIndices } = getPinnedColumnsInfo(element);

              const updatedPinnedIndices = [...new Set([...pinnedColumnIndices, columnIndex])].sort((a, b) => a - b);
              const mixedWidths = convertToMixedWidthMode(currentWidths, updatedPinnedIndices, tableWidth);

              setColumnWidths(editor, element, mixedWidths);
            }
          }
        };

        if (tableHeaderElement) {
          processContainer(tableHeaderElement);
        }

        if (tableBodyElement) {
          processContainer(tableBodyElement);
        }
      } catch (error) {
        console.warn('Failed to set column as title:', error);
      }
    },
    [editor, element],
  );

  const pinColumn: TableContextType['pinColumn'] = useCallback(
    (columnIndex: number) => {
      try {
        setColumnAsTitle(columnIndex, { pinned: true });
      } catch (error) {
        console.warn('Failed to pin column:', error);
      }
    },
    [setColumnAsTitle],
  );

  const unpinColumn: TableContextType['unpinColumn'] = useCallback(() => {
    try {
      const tableStructure = getTableStructure(editor, element);

      if (!tableStructure) return;

      const { tableHeaderElement, tableBodyElement } = tableStructure;

      // 檢查 column 與 row 之間是否有交叉 pinned 狀態的關係
      const shouldRowRemainPinned = (rowElement: TableElement, excludeColumns: Set<number>): boolean => {
        let hasNonExcludedCells = false;

        for (let colIndex = 0; colIndex < rowElement.children.length; colIndex++) {
          const cell = rowElement.children[colIndex];

          if (!Element.isElement(cell) || !cell.type.includes(TABLE_CELL_TYPE)) continue;
          if (excludeColumns.has(colIndex)) continue;

          hasNonExcludedCells = true;

          if (!cell.pinned) {
            return false;
          }
        }

        return hasNonExcludedCells;
      };

      const processContainer = (containerElement: TableElement) => {
        const containerPath = ReactEditor.findPath(editor, containerElement);
        const treatAsTitleColumns = new Set<number>();

        containerElement.children.forEach((row) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            row.children.forEach((cell, colIndex) => {
              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && cell.treatAsTitle) {
                treatAsTitleColumns.add(colIndex);
              }
            });
          }
        });

        containerElement.children.forEach((row, rowIndex) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            const rowShouldRemainPinned = shouldRowRemainPinned(row as TableElement, treatAsTitleColumns);

            row.children.forEach((cell, colIndex) => {
              if (treatAsTitleColumns.has(colIndex) && Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                const cellPath = [...containerPath, rowIndex, colIndex];

                Transforms.unsetNodes(editor, 'treatAsTitle', { at: cellPath });

                if (!rowShouldRemainPinned) {
                  Transforms.unsetNodes(editor, 'pinned', { at: cellPath });
                }
              }
            });
          }
        });
      };

      if (tableHeaderElement) {
        processContainer(tableHeaderElement);
      }

      if (tableBodyElement) {
        processContainer(tableBodyElement);
      }
    } catch (error) {
      console.warn('Failed to unpin column:', error);
    }
  }, [editor, element]);

  const setPinnedOnRowCells = useCallback(
    (row: TableElement, pinned: boolean) => {
      try {
        for (const [, cell] of row.children.entries()) {
          if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
            const cellPath = ReactEditor.findPath(editor, cell);

            if (pinned) {
              Transforms.setNodes(editor, { pinned: true } as Partial<TableElement>, { at: cellPath });
            } else {
              Transforms.unsetNodes(editor, 'pinned', { at: cellPath });
            }
          }
        }
      } catch (error) {
        console.warn('Failed to set pinned on row cells:', error);
      }
    },
    [editor],
  );

  const setPinnedOnAllHeaderRows = useCallback(
    (headerElement: TableElement, pinned: boolean) => {
      try {
        for (const headerRow of headerElement.children) {
          if (Element.isElement(headerRow) && headerRow.type.includes(TABLE_ROW_TYPE)) {
            setPinnedOnRowCells(headerRow as TableElement, pinned);
          }
        }
      } catch (error) {
        console.warn('Failed to set pinned on all header rows:', error);
      }
    },
    [setPinnedOnRowCells],
  );

  const pinRow: TableContextType['pinRow'] = useCallback(
    (rowIndex: number) => {
      try {
        const tableStructure = getTableStructure(editor, element);

        if (!tableStructure) return;

        const { tableHeaderElement, headerRowCount } = tableStructure;

        // 先將目前所有的 header rows 都設為 pinned
        if (tableHeaderElement) {
          setPinnedOnAllHeaderRows(tableHeaderElement, true);
        }

        // 然後將目標 row 移動到 header 中並設為 pinned
        if (rowIndex >= headerRowCount) {
          moveRowToHeader(rowIndex, { pinned: true });
        }
      } catch (error) {
        console.warn('Failed to pin row:', error);
      }
    },
    [editor, element, moveRowToHeader, setPinnedOnAllHeaderRows],
  );

  const unpinRow: TableContextType['unpinRow'] = useCallback(() => {
    try {
      const tableStructure = getTableStructure(editor, element);

      if (!tableStructure) return;

      const { tableHeaderElement, tableBodyElement, tableHeaderPath } = tableStructure;

      if (!tableHeaderElement || !tableBodyElement) return;

      // 檢查 column 與 row 之間是否有交叉 pinned 狀態的關係
      const shouldColumnRemainPinned = (columnIndex: number): boolean => {
        const containers = [tableHeaderElement, tableBodyElement];

        for (const container of containers) {
          if (!Element.isElement(container)) continue;

          for (const row of container.children) {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cell = row.children[columnIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                // 如果這個 cell 在 body 中且有 pinned 屬性，則 column 應該保持 pinned
                if (container.type === tableBodyElement.type && cell.pinned) {
                  return true;
                }
              }
            }
          }
        }

        return false;
      };

      tableHeaderElement.children.forEach((row, headerRowIndex) => {
        if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
          row.children.forEach((cell, colIndex) => {
            if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
              const cellPath = [...tableHeaderPath!, headerRowIndex, colIndex];

              if (!shouldColumnRemainPinned(colIndex)) {
                Transforms.unsetNodes(editor, 'pinned', { at: cellPath });
              }
            }
          });
        }
      });

      const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);

      for (let i = tableHeaderElement.children.length - 1; i >= 0; i--) {
        const row = tableHeaderElement.children[i];

        if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
          const fromPath = [...tableHeaderPath!, i];
          const toPath = [...tableBodyPath, 0];

          Transforms.moveNodes(editor, {
            at: fromPath,
            to: toPath,
          });
        }
      }
    } catch (error) {
      console.warn('Failed to unpin row:', error);
    }
  }, [editor, element]);

  return {
    addColumn,
    addRow,
    addColumnAndRow,
    deleteRow,
    deleteColumn,
    moveRowToBody,
    moveRowToHeader,
    unsetColumnAsTitle,
    setColumnAsTitle,
    pinColumn,
    unpinColumn,
    pinRow,
    unpinRow,
    isColumnPinned,
    isRowPinned,
  };
}
