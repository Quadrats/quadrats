import { useCallback, useRef, useState } from 'react';
import { useSlateStatic } from 'slate-react';
import { Editor, Transforms } from '@quadrats/core';
import { TableElement, ColumnWidth, calculateTableMinWidth } from '@quadrats/common/table';
import { calculateResizedColumnWidths, getColumnWidths, setColumnWidths, getPinnedColumnsInfo } from '../utils/helper';
import { useTableStateContext } from './useTableStateContext';

interface UseColumnResizeParams {
  tableElement: TableElement;
  columnIndex: number;
  cellRef: React.RefObject<HTMLTableCellElement | null>;
}

interface UseColumnResizeReturn {
  isResizing: boolean;
  handleResizeStart: (e: React.MouseEvent) => void;
}

export function useColumnResize({ tableElement, columnIndex, cellRef }: UseColumnResizeParams): UseColumnResizeReturn {
  const editor = useSlateStatic();
  const { setTableSelectedOn } = useTableStateContext();
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<{
    startX: number;
    startWidths: ColumnWidth[];
    tableWidth: number;
    containerWidth: number;
    pinnedColumnIndices: number[];
    tableDOMElement: HTMLTableElement;
  } | null>(null);

  const currentWidthsRef = useRef<ColumnWidth[] | null>(null);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      // 清除當前的 focus 狀態和 table selection
      Transforms.deselect(editor);
      setTableSelectedOn(undefined);

      const cell = cellRef.current;

      if (!cell) return;

      // 找到 table DOM 元素和 scroll container
      const tableDOMElement = cell.closest('table');
      const scrollContainer = tableDOMElement?.closest('.qdr-table__scrollContainer') as HTMLDivElement | null;

      if (!tableDOMElement || !scrollContainer) return;

      const tableRect = tableDOMElement.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      // 獲取釘選欄位資訊
      const { pinnedColumnIndices } = getPinnedColumnsInfo(tableElement);

      // 儲存初始狀態
      resizeDataRef.current = {
        startX: e.clientX,
        startWidths: getColumnWidths(tableElement, tableRect.width),
        tableWidth: tableRect.width,
        containerWidth: containerRect.width,
        pinnedColumnIndices,
        tableDOMElement,
      };

      setIsResizing(true);

      // 顯示 size indicators 容器
      const mainWrapper = tableDOMElement.closest('.qdr-table__mainWrapper');
      const sizeIndicatorsContainer = mainWrapper?.querySelector('.qdr-table__size-indicators') as HTMLElement | null;

      if (sizeIndicatorsContainer) {
        sizeIndicatorsContainer.style.display = 'flex';
      }

      // 為當前 column 的所有 cell 添加 resizing class
      const allRows = tableDOMElement.querySelectorAll('tr');

      allRows.forEach((row) => {
        const cells = row.querySelectorAll('td, th');
        const targetCell = cells[columnIndex];

        if (targetCell) {
          targetCell.classList.add('qdr-table__cell--resizing');
        }
      });

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizeDataRef.current) return;

        const { startX, startWidths, tableWidth, pinnedColumnIndices, tableDOMElement } = resizeDataRef.current;

        const deltaX = moveEvent.clientX - startX;

        // 將位移轉換為百分比
        const deltaPercentage = (deltaX / tableWidth) * 100;

        // 計算新的欄位寬度
        const newWidths = calculateResizedColumnWidths(
          startWidths,
          columnIndex,
          deltaPercentage,
          deltaX,
          pinnedColumnIndices,
        );

        // 儲存計算結果，但不更新 Slate
        currentWidthsRef.current = newWidths;

        // 更新 table 的最小寬度
        tableDOMElement.style.minWidth = calculateTableMinWidth(newWidths);

        // 直接更新 DOM 的 <col> 元素
        const colgroup = tableDOMElement.querySelector('colgroup');

        if (colgroup) {
          const cols = colgroup.querySelectorAll('col');

          newWidths.forEach((width, index) => {
            const col = cols[index];

            if (col) {
              const cssWidth = width.type === 'percentage' ? `${width.value.toFixed(1)}%` : `${width.value}px`;

              col.style.width = cssWidth;
              col.style.minWidth = cssWidth;
            }
          });
        }

        // 更新 size indicators
        const sizeIndicatorsContainer = mainWrapper?.querySelector('.qdr-table__size-indicators');

        if (sizeIndicatorsContainer) {
          const indicators = sizeIndicatorsContainer.querySelectorAll('.qdr-table__size-indicator');

          newWidths.forEach((width, index) => {
            const indicator = indicators[index] as HTMLDivElement;

            if (indicator) {
              const cssWidth = width.type === 'percentage' ? `${width.value.toFixed(1)}%` : `${width.value}px`;
              const displayWidth = width.type === 'percentage' ? `${width.value.toFixed(1)}%` : `${width.value}px`;

              indicator.style.width = cssWidth;
              indicator.style.minWidth = cssWidth;

              // 更新顯示文字
              const sizeText = indicator.querySelector('.qdr-table__size');

              if (sizeText) {
                sizeText.textContent = displayWidth;
              }
            }
          });
        }
      };

      const handleMouseUp = () => {
        const allRows = tableDOMElement.querySelectorAll('tr');

        allRows.forEach((row) => {
          const cells = row.querySelectorAll('td, th');
          const targetCell = cells[columnIndex];

          if (targetCell) {
            targetCell.classList.remove('qdr-table__cell--resizing');
          }
        });

        // 隱藏 size indicators 容器
        const mainWrapper = tableDOMElement.closest('.qdr-table__mainWrapper');
        const sizeIndicatorsContainer = mainWrapper?.querySelector('.qdr-table__size-indicators') as HTMLElement | null;

        if (sizeIndicatorsContainer) {
          sizeIndicatorsContainer.style.display = 'none';
        }

        // 將最終寬度寫入 Slate
        if (currentWidthsRef.current) {
          Editor.withoutNormalizing(editor, () => {
            setColumnWidths(editor, tableElement, currentWidthsRef.current!);
          });
        }

        setIsResizing(false);
        resizeDataRef.current = null;
        currentWidthsRef.current = null;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [editor, columnIndex, cellRef, tableElement, setTableSelectedOn],
  );

  return {
    isResizing,
    handleResizeStart,
  };
}
