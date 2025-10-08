import React, { useContext, useRef, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { Transforms } from '@quadrats/core';
import { useSlateStatic } from 'slate-react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon, Portal } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { TableElement } from '@quadrats/common/table';
import { useTableMetadata } from '../hooks/useTableMetadata';
import { useTableState } from '../hooks/useTableState';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { useTableCellFocused, useTableCellPosition, useTableCellTransformContent } from '../hooks/useTableCell';
import { useTableCellToolbarActions } from '../hooks/useTableCellToolbarActions';
import { TableScrollContext } from '../contexts/TableScrollContext';
import { useColumnResize } from '../hooks/useColumnResize';

function TableCell(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;
  const { tableSelectedOn, setTableSelectedOn, tableHoveredOn, setTableHoveredOn } = useTableState();
  const { columnCount, rowCount, portalContainerRef, isColumnPinned, tableElement } = useTableMetadata();

  // Component context
  const { isHeader } = useContext(TableHeaderContext);
  const { scrollTop, scrollRef } = useContext(TableScrollContext);
  const editor = useSlateStatic();

  // Cell-specific hooks
  const focused = useTableCellFocused(element, editor);
  const cellPosition = useTableCellPosition(element, editor);
  const transformCellContent = useTableCellTransformContent(element, editor);

  // Toolbar actions - 所有 icon actions 邏輯都在這個 hook 中
  const { focusToolbarIconGroups, inlineToolbarIconGroups } = useTableCellToolbarActions({
    element,
    cellPosition,
    isHeader,
    transformCellContent,
  });

  const isSelectedInSameRow = tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex;
  const isSelectedInSameColumn =
    tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex;

  const isSelectionTriggerByMe =
    (isSelectedInSameRow && cellPosition.columnIndex === 0) || (isSelectedInSameColumn && cellPosition.rowIndex === 0);

  const showRowActionButton = useMemo(
    () =>
      cellPosition.rowIndex === 0 &&
      (isSelectedInSameColumn || (tableHoveredOn?.columnIndex === cellPosition.columnIndex && !tableSelectedOn)),
    [cellPosition, isSelectedInSameColumn, tableHoveredOn, tableSelectedOn],
  );

  const showColumnActionButton = useMemo(
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
  }, [focused, isSelectionTriggerByMe, cellPosition.columnIndex, cellPosition.rowIndex, portalContainerRef, scrollTop]);

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
        'qdr-table__cell--top-active': isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === 0),
        'qdr-table__cell--right-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === columnCount - 1),
        'qdr-table__cell--bottom-active':
          isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === rowCount - 1),
        'qdr-table__cell--left-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === 0),
        'qdr-table__cell--is-selection-trigger-by-me': isSelectionTriggerByMe,
      })}
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
      {showColumnActionButton && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <button
            type="button"
            contentEditable={false}
            style={{
              top: rowButtonPosition?.top,
              left: rowButtonPosition?.left,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Clear focus by removing selection
              Transforms.deselect(editor);

              setTableSelectedOn((prev) => {
                if (prev?.region === 'row' && prev.index === cellPosition.rowIndex) {
                  return undefined;
                }

                return { region: 'row', index: cellPosition.rowIndex };
              });
            }}
            className="qdr-table__cell-row-action"
          >
            <Icon icon={Drag} width={20} height={20} />
          </button>
        </Portal>
      )}
      {showRowActionButton && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <button
            type="button"
            contentEditable={false}
            style={{
              // pinned 時因為 sticky 所以要扣掉 scrollTop
              top: (columnButtonPosition?.top ?? 0) - (element.pinned ? scrollTop : 0),
              left: columnButtonPosition?.left,
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              // Clear focus by removing selection
              Transforms.deselect(editor);

              setTableSelectedOn((prev) => {
                if (prev?.region === 'column' && prev.index === cellPosition.columnIndex) {
                  return undefined;
                }

                return { region: 'column', index: cellPosition.columnIndex };
              });
            }}
            className="qdr-table__cell-column-action"
          >
            <Icon icon={Drag} width={20} height={20} />
          </button>
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
          />
        </Portal>
      ) : null}
    </TagName>
  );
}

export default TableCell;
