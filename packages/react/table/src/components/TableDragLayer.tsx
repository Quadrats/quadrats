import React, { useEffect, useState } from 'react';
import { useDragLayer } from 'react-dnd';
import { useTableDragContext } from '../contexts/TableDragContext';

interface DragLayerProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const TableDragLayer: React.FC<DragLayerProps> = ({ scrollRef }) => {
  const { dragState } = useTableDragContext();
  const [columnWidths, setColumnWidths] = useState<number[]>([]);
  const [rowHeights, setRowHeights] = useState<number[]>([]);

  const { isDragging, currentOffset } = useDragLayer((monitor) => ({
    isDragging: monitor.isDragging(),
    currentOffset: monitor.getClientOffset(),
  }));

  // 計算所有 column 的寬度和 row 的高度
  useEffect(() => {
    if (!scrollRef.current || !isDragging) return;

    const tableContainer = scrollRef.current;
    const cells = tableContainer.querySelectorAll('.qdr-table__cell');

    if (dragState?.type === 'column') {
      // 計算每個 column 的寬度
      const widths: number[] = [];
      const columnCells = Array.from(cells).filter((cell) => {
        const cellElement = cell as HTMLElement;

        return cellElement.dataset.columnIndex !== undefined;
      });

      const columnCount =
        Math.max(
          ...columnCells.map((cell) => {
            const cellElement = cell as HTMLElement;

            return parseInt(cellElement.dataset.columnIndex || '0', 10);
          }),
        ) + 1;

      for (let i = 0; i < columnCount; i++) {
        const cellsInColumn = columnCells.filter((cell) => {
          const cellElement = cell as HTMLElement;

          return parseInt(cellElement.dataset.columnIndex || '0', 10) === i;
        });

        if (cellsInColumn.length > 0) {
          const firstCell = cellsInColumn[0] as HTMLElement;

          widths[i] = firstCell.getBoundingClientRect().width;
        }
      }

      setColumnWidths(widths);
    } else if (dragState?.type === 'row') {
      // 計算每個 row 的高度
      const heights: number[] = [];
      const rowCells = Array.from(cells).filter((cell) => {
        const cellElement = cell as HTMLElement;

        return cellElement.dataset.rowIndex !== undefined;
      });

      const rowCount =
        Math.max(
          ...rowCells.map((cell) => {
            const cellElement = cell as HTMLElement;

            return parseInt(cellElement.dataset.rowIndex || '0', 10);
          }),
        ) + 1;

      for (let i = 0; i < rowCount; i++) {
        const cellsInRow = rowCells.filter((cell) => {
          const cellElement = cell as HTMLElement;

          return parseInt(cellElement.dataset.rowIndex || '0', 10) === i;
        });

        if (cellsInRow.length > 0) {
          const firstCell = cellsInRow[0] as HTMLElement;

          heights[i] = firstCell.getBoundingClientRect().height;
        }
      }

      setRowHeights(heights);
    }
  }, [isDragging, dragState, scrollRef]);

  if (!isDragging || !dragState || !currentOffset || !scrollRef.current) {
    return null;
  }

  const tableContainer = scrollRef.current;
  const tableRect = tableContainer.getBoundingClientRect();

  // 渲染 column overlay
  if (dragState.type === 'column') {
    const sourceColumnIndex = dragState.columnIndex;
    const columnWidth = columnWidths[sourceColumnIndex];

    return (
      <div
        className="qdr-table__drag-overlay"
        style={{
          left: tableRect.left,
          top: tableRect.top,
          width: columnWidth,
          height: tableRect.height,
          transform: `translateX(${currentOffset.x - tableRect.left - columnWidth / 2}px)`,
        }}
      >
        <div className="qdr-table__drag-overlay-content" />
      </div>
    );
  }

  // 渲染 row overlay
  if (dragState.type === 'row') {
    const sourceRowIndex = dragState.rowIndex;
    const rowHeight = rowHeights[sourceRowIndex];

    return (
      <div
        className="qdr-table__drag-overlay"
        style={{
          left: tableRect.left,
          top: tableRect.top,
          width: tableRect.width,
          height: rowHeight,
          transform: `translateY(${currentOffset.y - tableRect.top - rowHeight / 2}px)`,
        }}
      >
        <div className="qdr-table__drag-overlay-content" />
      </div>
    );
  }

  return null;
};
