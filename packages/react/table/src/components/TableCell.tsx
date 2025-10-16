import React, { useContext, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { Transforms, Element } from '@quadrats/core';
import { useSlateStatic } from 'slate-react';
import { useDrop } from 'react-dnd';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Portal } from '@quadrats/react/components';
import { TableElement } from '@quadrats/common/table';
import { useTableMetadata } from '../hooks/useTableMetadata';
import { useTableStateContext } from '../hooks/useTableStateContext';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { useTableCellFocused, useTableCellPosition, useTableCellTransformContent } from '../hooks/useTableCell';
import { useTableCellToolbarActions } from '../hooks/useTableCellToolbarActions';
import { TableScrollContext } from '../contexts/TableScrollContext';
import { useColumnResize } from '../hooks/useColumnResize';
import { useTableActionsContext } from '../hooks/useTableActionsContext';
import { useTableDragContext } from '../contexts/TableDragContext';
import { ROW_DRAG_TYPE, RowDragButton } from './RowDragButton';
import { COLUMN_DRAG_TYPE, ColumnDragButton } from './ColumnDragButton';
import { getTableElements } from '../utils/helper';

function TableCell(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;
  const { tableSelectedOn, setTableSelectedOn, tableHoveredOn, setTableHoveredOn } = useTableStateContext();
  const { columnCount, rowCount, portalContainerRef, isColumnPinned, tableElement } = useTableMetadata();
  const { moveOrSwapRow, moveOrSwapColumn } = useTableActionsContext();
  const { dragState, dropTargetIndex, setDropTargetIndex, dragDirection, setDragDirection } = useTableDragContext();

  // Component context
  const { isHeader } = useContext(TableHeaderContext);
  const { scrollTop, scrollLeft, scrollRef } = useContext(TableScrollContext);
  const editor = useSlateStatic();

  // Cell-specific hooks
  const focused = useTableCellFocused(element, editor);
  const cellPosition = useTableCellPosition(element, editor);
  const transformCellContent = useTableCellTransformContent(element, editor);

  // Get header row count from table structure
  const tableElements = getTableElements(tableElement);
  const headerRowCount = tableElements.tableHeaderElement?.children.length || 0;

  // Helper to check if column is title column
  const checkIsTitleColumn = useCallback(
    (colIndex: number) => {
      const elements = getTableElements(tableElement);

      if (!elements.tableBodyElement) return false;

      const firstRow = elements.tableBodyElement.children[0];

      if (!Element.isElement(firstRow)) return false;

      const cell = firstRow.children[colIndex];

      return Element.isElement(cell) && !!cell.treatAsTitle;
    },
    [tableElement],
  );

  // Toolbar actions
  const { focusToolbarIconGroups, inlineToolbarIconGroups } = useTableCellToolbarActions({
    element,
    cellPosition,
    isHeader,
    transformCellContent,
  });

  const isSelectedInSameRow = tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex;
  const isSelectedInSameColumn =
    tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex;

  // 判斷是否為正在被拖曳的 row/column
  const isDraggingThisRow = dragState?.type === 'row' && dragState.rowIndex === cellPosition.rowIndex;
  const isDraggingThisColumn = dragState?.type === 'column' && dragState.columnIndex === cellPosition.columnIndex;

  const isSelectionTriggerByMe =
    (isSelectedInSameRow && cellPosition.columnIndex === 0) || (isSelectedInSameColumn && cellPosition.rowIndex === 0);

  const showColumnActionButton = useMemo(
    () =>
      cellPosition.rowIndex === 0 &&
      (isSelectedInSameColumn || (tableHoveredOn?.columnIndex === cellPosition.columnIndex && !tableSelectedOn)),
    [cellPosition, isSelectedInSameColumn, tableHoveredOn, tableSelectedOn],
  );

  const showRowActionButton = useMemo(
    () =>
      cellPosition.columnIndex === 0 &&
      (isSelectedInSameRow || (tableHoveredOn?.rowIndex === cellPosition.rowIndex && !tableSelectedOn)),
    [cellPosition, isSelectedInSameRow, tableHoveredOn, tableSelectedOn],
  );

  // 用於定位 InlineToolbar 的 ref
  const cellRef = useRef<HTMLTableCellElement>(null);
  const [toolbarPosition, setToolbarPosition] = useState<{ top: number; left: number } | null>(null);
  const [rowButtonPosition, setRowButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [columnButtonPosition, setColumnButtonPosition] = useState<{ top: number; left: number } | null>(null);
  const [cellStuckAtLeft, setCellStuckAtLeft] = useState<number | undefined>(undefined);

  const [, dropRow] = useDrop<{ rowIndex: number; isInHeader: boolean }, void, void>(
    () => ({
      accept: ROW_DRAG_TYPE,
      canDrop: (item) => {
        if (!dragState || dragState.type !== 'row') return false;
        if (item.rowIndex === cellPosition.rowIndex) return false;

        const sourceInHeader = item.isInHeader;
        const targetInHeader = cellPosition.rowIndex < headerRowCount;

        return sourceInHeader === targetInHeader;
      },
      hover: (item, monitor) => {
        if (!monitor.canDrop()) {
          setDropTargetIndex(null);
          setDragDirection(null);

          return;
        }

        const direction = item.rowIndex < cellPosition.rowIndex ? 'down' : 'up';

        setDropTargetIndex(cellPosition.rowIndex);
        setDragDirection(direction);
      },
      drop: (item) => {
        moveOrSwapRow(item.rowIndex, cellPosition.rowIndex, 'move');
        setDropTargetIndex(null);
        setDragDirection(null);
      },
    }),
    [dragState, cellPosition.rowIndex, headerRowCount, moveOrSwapRow, setDropTargetIndex, setDragDirection],
  );

  // Drop target logic for columns
  const [, dropColumn] = useDrop<{ columnIndex: number; isTitle: boolean }, void, void>(
    () => ({
      accept: COLUMN_DRAG_TYPE,
      canDrop: (item) => {
        if (!dragState || dragState.type !== 'column') return false;
        if (item.columnIndex === cellPosition.columnIndex) return false;

        const sourceIsTitle = item.isTitle;
        const targetIsTitle = checkIsTitleColumn(cellPosition.columnIndex);

        return sourceIsTitle === targetIsTitle;
      },
      hover: (item, monitor) => {
        if (!monitor.canDrop()) {
          setDropTargetIndex(null);
          setDragDirection(null);

          return;
        }

        // 計算拖曳方向
        const direction = item.columnIndex < cellPosition.columnIndex ? 'right' : 'left';

        setDropTargetIndex(cellPosition.columnIndex);
        setDragDirection(direction);
      },
      drop: (item) => {
        moveOrSwapColumn(item.columnIndex, cellPosition.columnIndex, 'move');
        setDropTargetIndex(null);
        setDragDirection(null);
      },
    }),
    [dragState, cellPosition.columnIndex, checkIsTitleColumn, moveOrSwapColumn, setDropTargetIndex, setDragDirection],
  );

  // Combine refs
  dropRow(dropColumn(cellRef));

  // Column resize
  const { isResizing, handleResizeStart } = useColumnResize({
    tableElement,
    columnIndex: cellPosition.columnIndex,
    cellRef,
  });

  useEffect(() => {
    const { current: cell } = cellRef;
    const { current: portalContainer } = portalContainerRef;

    if (!cell || !portalContainer) {
      setToolbarPosition(null);
      setRowButtonPosition(null);
      setColumnButtonPosition(null);

      return;
    }

    const rafId = requestAnimationFrame(() => {
      const cellRect = cell.getBoundingClientRect();
      const portalContainerRect = portalContainer.getBoundingClientRect();

      // 工具列位置 (針對 focused 狀態)
      if (focused || isSelectionTriggerByMe) {
        setToolbarPosition({
          top: cellRect.top - portalContainerRect.top - 4, // -4px offset
          left: cellRect.left - portalContainerRect.left,
        });
      } else {
        setToolbarPosition(null);
      }

      // 行按鈕位置 (顯示在第一列)
      if (cellPosition.columnIndex === 0) {
        setRowButtonPosition({
          top: Math.min(cellRect.top - portalContainerRect.top + cellRect.height / 2 - 10, 0), // 置中，按鈕高度約 20px
          left: cellRect.left - portalContainerRect.left - 10, // 向左偏移 10px
        });
      } else {
        setRowButtonPosition(null);
      }

      // 列按鈕位置 (顯示在第一行)
      if (cellPosition.rowIndex === 0) {
        setColumnButtonPosition({
          top: cellRect.top - portalContainerRect.top - 10 + scrollTop, // 向上偏移 10px
          left: cellRect.left - portalContainerRect.left + cellRect.width / 2 - 10, // 置中，按鈕寬度約 20px
        });
      } else {
        setColumnButtonPosition(null);
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [
    focused,
    isSelectionTriggerByMe,
    cellPosition.columnIndex,
    cellPosition.rowIndex,
    portalContainerRef,
    scrollTop,
    scrollLeft,
  ]);

  useEffect(() => {
    const { current: cell } = cellRef;
    const { current: scrollContainer } = scrollRef;

    if (scrollContainer && cell) {
      const cellRect = cell.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      setCellStuckAtLeft(Math.max(Math.round(cellRect.left - containerRect.left), 0));
    }
  }, [scrollRef]);

  const TagName = isHeader ? 'th' : 'td';
  const myColumnIsPinned = isColumnPinned(cellPosition.columnIndex) && element.treatAsTitle;

  return (
    <TagName
      {...attributes}
      ref={cellRef}
      onMouseEnter={() => {
        setTableHoveredOn({ columnIndex: cellPosition.columnIndex, rowIndex: cellPosition.rowIndex });
      }}
      onMouseLeave={() => {
        setTableHoveredOn(undefined);
      }}
      className={clsx('qdr-table__cell', {
        'qdr-table__cell--header': isHeader || element.treatAsTitle,
        'qdr-table__cell--pinned': myColumnIsPinned,
        'qdr-table__cell--top-active':
          isSelectedInSameRow ||
          (isSelectedInSameColumn && cellPosition.rowIndex === 0) ||
          isDraggingThisRow ||
          (isDraggingThisColumn && cellPosition.rowIndex === 0),
        'qdr-table__cell--right-active':
          isSelectedInSameColumn ||
          (isSelectedInSameRow && cellPosition.columnIndex === columnCount - 1) ||
          isDraggingThisColumn ||
          (isDraggingThisRow && cellPosition.columnIndex === columnCount - 1),
        'qdr-table__cell--bottom-active':
          isSelectedInSameRow ||
          (isSelectedInSameColumn && cellPosition.rowIndex === rowCount - 1) ||
          isDraggingThisRow ||
          (isDraggingThisColumn && cellPosition.rowIndex === rowCount - 1),
        'qdr-table__cell--left-active':
          isSelectedInSameColumn ||
          (isSelectedInSameRow && cellPosition.columnIndex === 0) ||
          isDraggingThisColumn ||
          (isDraggingThisRow && cellPosition.columnIndex === 0),
        'qdr-table__cell--is-selection-trigger-by-me': isSelectionTriggerByMe,
        'qdr-table__cell--drag-row-target-top':
          dragState?.type === 'row' &&
          dropTargetIndex === cellPosition.rowIndex &&
          dropTargetIndex !== dragState.rowIndex &&
          dragDirection === 'up',
        'qdr-table__cell--drag-row-target-bottom':
          dragState?.type === 'row' &&
          dropTargetIndex === cellPosition.rowIndex &&
          dropTargetIndex !== dragState.rowIndex &&
          dragDirection === 'down',
        'qdr-table__cell--drag-column-target-left':
          dragState?.type === 'column' &&
          dropTargetIndex === cellPosition.columnIndex &&
          dropTargetIndex !== dragState.columnIndex &&
          dragDirection === 'left',
        'qdr-table__cell--drag-column-target-right':
          dragState?.type === 'column' &&
          dropTargetIndex === cellPosition.columnIndex &&
          dropTargetIndex !== dragState.columnIndex &&
          dragDirection === 'right',
      })}
      data-row-index={cellPosition.rowIndex}
      data-column-index={cellPosition.columnIndex}
      style={
        myColumnIsPinned
          ? {
              left: cellStuckAtLeft,
            }
          : undefined
      }
    >
      {children}
      <div
        contentEditable={false}
        data-slate-editor={false}
        className={clsx('qdr-table__cell__resize-handle', {
          'qdr-table__cell__resize-handle--active': isResizing,
        })}
        onMouseDown={handleResizeStart}
      />
      {focused && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <InlineToolbar
            className={'qdr-table__cell__focus-toolbar'}
            style={{
              top: toolbarPosition?.top,
              left: toolbarPosition?.left,
            }}
            iconGroups={focusToolbarIconGroups}
          />
        </Portal>
      )}
      {showRowActionButton && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <RowDragButton
            rowIndex={cellPosition.rowIndex}
            headerRowCount={headerRowCount}
            style={{
              top: rowButtonPosition?.top,
              left: rowButtonPosition?.left,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              Transforms.deselect(editor);

              setTableSelectedOn((prev) => {
                if (prev?.region === 'row' && prev.index === cellPosition.rowIndex) {
                  return undefined;
                }

                return { region: 'row', index: cellPosition.rowIndex };
              });
            }}
          />
        </Portal>
      )}
      {showColumnActionButton && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <ColumnDragButton
            columnIndex={cellPosition.columnIndex}
            style={{
              // pinned 時因為 sticky 所以要扣掉 scrollTop
              top: (columnButtonPosition?.top ?? 0) - (element.pinned ? scrollTop : 0),
              left: columnButtonPosition?.left,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              Transforms.deselect(editor);

              setTableSelectedOn((prev) => {
                if (prev?.region === 'column' && prev.index === cellPosition.columnIndex) {
                  return undefined;
                }

                return { region: 'column', index: cellPosition.columnIndex };
              });
            }}
            checkIsTitleColumn={checkIsTitleColumn}
          />
        </Portal>
      )}
      {isSelectionTriggerByMe && (cellPosition.columnIndex === 0 || cellPosition.rowIndex === 0) ? (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <InlineToolbar
            className="qdr-table__cell__inline-table-toolbar"
            style={{
              top: toolbarPosition?.top,
              left: toolbarPosition?.left,
            }}
            iconGroups={inlineToolbarIconGroups}
            onClickAway={() => {
              setTableSelectedOn(undefined);
            }}
          />
        </Portal>
      ) : null}
    </TagName>
  );
}

export default TableCell;
