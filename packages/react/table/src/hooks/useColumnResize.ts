import { useCallback, useRef, useState } from 'react';
import { useSlateStatic } from 'slate-react';
import { Editor } from '@quadrats/core';
import { TableElement, ColumnWidth } from '@quadrats/common/table';
import { calculateResizedColumnWidths, getColumnWidths, setColumnWidths } from '../utils/helper';

interface UseColumnResizeParams {
  tableElement: TableElement;
  columnIndex: number;
  cellRef: React.RefObject<HTMLTableCellElement | null>;
}

interface UseColumnResizeReturn {
  isResizing: boolean;
  handleResizeStart: (e: React.MouseEvent) => void;
}

/**
 * Hook for handling column resize functionality
 * Supports both flexible (percentage) and fixed (pixel) columns
 */
export function useColumnResize({ tableElement, columnIndex, cellRef }: UseColumnResizeParams): UseColumnResizeReturn {
  const editor = useSlateStatic();
  const [isResizing, setIsResizing] = useState(false);
  const resizeDataRef = useRef<{
    startX: number;
    startWidths: ColumnWidth[];
    tableWidth: number;
  } | null>(null);

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const cell = cellRef.current;

      if (!cell) return;

      // 找到 table DOM 元素
      const tableDOMElement = cell.closest('table');

      if (!tableDOMElement) return;

      const tableRect = tableDOMElement.getBoundingClientRect();

      // 儲存初始狀態
      resizeDataRef.current = {
        startX: e.clientX,
        startWidths: getColumnWidths(tableElement),
        tableWidth: tableRect.width,
      };

      setIsResizing(true);

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!resizeDataRef.current) return;

        const { startX, startWidths, tableWidth } = resizeDataRef.current;
        const deltaX = moveEvent.clientX - startX;

        // 將位移轉換為百分比
        const deltaPercentage = (deltaX / tableWidth) * 100;

        // 計算新的欄位寬度（會自動處理 pixel 和 percentage 的混合情況）
        const newWidths = calculateResizedColumnWidths(startWidths, columnIndex, deltaPercentage);

        // 使用 Editor.withoutNormalizing 來批次更新
        Editor.withoutNormalizing(editor, () => {
          setColumnWidths(editor, tableElement, newWidths);
        });
      };

      const handleMouseUp = () => {
        setIsResizing(false);
        resizeDataRef.current = null;

        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [editor, columnIndex, cellRef, tableElement],
  );

  return {
    isResizing,
    handleResizeStart,
  };
}
