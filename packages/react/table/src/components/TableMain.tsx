import React, { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ReactEditor, RenderElementProps, useModal, useSlateStatic } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { AlignCenter, AlignLeft, AlignRight, Plus, Trash } from '@quadrats/icons';
import { useTableActionsContext } from '../hooks/useTableActionsContext';
import { useTableMetadata } from '../hooks/useTableMetadata';
import { useTableStateContext } from '../hooks/useTableStateContext';
import { InlineToolbar, ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';
import { Transforms } from 'slate';
import { calculateTableMinWidth, columnWidthToCSS, TableElement } from '@quadrats/common/table';
import { TableScrollContext } from '../contexts/TableScrollContext';
import { useTableCellAlign, useTableCellAlignStatus } from '../hooks/useTableCell';
import { getTableElements, getColumnWidths } from '../utils/helper';

function TableMain(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  const { setConfirmModalConfig } = useModal();
  const editor = useSlateStatic();

  const { addColumn, addRow, addColumnAndRow } = useTableActionsContext();
  const { isReachMaximumColumns, isReachMaximumRows, tableElement } = useTableMetadata();
  const { tableSelectedOn } = useTableStateContext();

  // Table align functions
  const setAlign = useTableCellAlign(tableElement, editor);
  const getAlign = useTableCellAlignStatus(tableElement, editor);

  const tablePath = ReactEditor.findPath(editor, tableElement);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [scrollLeft, setScrollLeft] = useState<number>(0);
  const [tableWidth, setTableWidth] = useState<number>(0);
  const scrollUpdateTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingScrollRef = useRef<boolean>(false); // 標記是否正在更新滾動位置
  const previousColumnWidthsRef = useRef<string>(''); // 追蹤 columnWidths 的變化

  // sizing
  const { tableBodyElement } = getTableElements(tableElement);
  const firstRowCells = tableBodyElement?.children[0].children as TableElement[] | undefined;

  // 獲取欄位寬度（傳入 tableWidth 以支援混合模式）
  const columnWidths = useMemo(() => getColumnWidths(tableElement, tableWidth), [tableElement, tableWidth]);

  // 計算 table 的最小寬度
  const tableMinWidth = useMemo(() => calculateTableMinWidth(columnWidths), [columnWidths]);

  // 監聽 table 寬度變化
  useEffect(() => {
    const { current: table } = tableRef;

    if (!table) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setTableWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(table);

    // 初始化寬度
    setTableWidth(table.getBoundingClientRect().width);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    const { current: scrollContainer } = scrollRef;

    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop);
      setScrollLeft(scrollContainer.scrollLeft);

      // 如果正在程式化更新滾動位置，不要觸發 Slate 更新
      if (isUpdatingScrollRef.current) {
        return;
      }

      // 使用 debounce 來減少 Slate 更新頻率
      if (scrollUpdateTimerRef.current) {
        clearTimeout(scrollUpdateTimerRef.current);
      }

      scrollUpdateTimerRef.current = setTimeout(() => {
        // 更新 tableElement 的 scrollPosition
        const tablePath = ReactEditor.findPath(editor, tableElement);

        Transforms.setNodes(
          editor,
          {
            scrollPosition: {
              scrollLeft: scrollContainer.scrollLeft,
              scrollTop: scrollContainer.scrollTop,
            },
          } as Partial<TableElement>,
          { at: tablePath },
        );
      }, 300); // 300ms debounce
    };

    scrollContainer.addEventListener('scroll', handleScroll, false);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll, false);

      if (scrollUpdateTimerRef.current) {
        clearTimeout(scrollUpdateTimerRef.current);
      }
    };
  }, [editor, tableElement]);

  // 只在 columnWidths 改變時恢復滾動位置
  useEffect(() => {
    const { current: scrollContainer } = scrollRef;

    if (!scrollContainer || !tableElement.scrollPosition) return;

    // 檢查 columnWidths 是否真的改變了
    const currentColumnWidthsStr = JSON.stringify(columnWidths);

    if (previousColumnWidthsRef.current !== currentColumnWidthsStr) {
      previousColumnWidthsRef.current = currentColumnWidthsStr;

      // 標記正在更新，避免觸發 handleScroll
      isUpdatingScrollRef.current = true;

      // 使用 requestAnimationFrame 確保 DOM 已更新
      requestAnimationFrame(() => {
        scrollContainer.scrollLeft = tableElement.scrollPosition?.scrollLeft ?? 0;
        scrollContainer.scrollTop = tableElement.scrollPosition?.scrollTop ?? 0;

        // 重置標記
        setTimeout(() => {
          isUpdatingScrollRef.current = false;
        }, 100);
      });
    }
  }, [columnWidths, tableElement.scrollPosition]);

  const scrollContextValue = useMemo(() => ({ scrollTop, scrollLeft, scrollRef }), [scrollTop, scrollLeft, scrollRef]);

  // 獲取當前 table 的 align 狀態
  const currentTableAlign = getAlign('table');

  // 根據當前 table align 狀態選擇對應的 icon
  const getCurrentTableAlignIcon = () => {
    switch (currentTableAlign) {
      case 'left':
        return AlignLeft;
      case 'center':
        return AlignCenter;
      case 'right':
        return AlignRight;
      default:
        return AlignLeft;
    }
  };

  return (
    <div
      className={clsx('qdr-table__mainWrapper', {
        'qdr-table__mainWrapper--selected': tableSelectedOn?.region === 'table',
      })}
    >
      <InlineToolbar
        className="qdr-table__table-toolbar"
        iconGroups={[
          {
            icons: [
              <ToolbarGroupIcon key="table-align-change" icon={getCurrentTableAlignIcon()}>
                <ToolbarIcon
                  icon={AlignLeft}
                  onClick={() => {
                    setAlign('left', 'table');
                  }}
                />
                <ToolbarIcon
                  icon={AlignCenter}
                  onClick={() => {
                    setAlign('center', 'table');
                  }}
                />
                <ToolbarIcon
                  icon={AlignRight}
                  onClick={() => {
                    setAlign('right', 'table');
                  }}
                />
              </ToolbarGroupIcon>,
            ],
          },
          {
            icons: [
              {
                icon: Trash,
                className: 'qdr-table__delete',
                onClick: () => {
                  setConfirmModalConfig({
                    title: '刪除表格',
                    content: '是否確認刪除此表格？刪除後將立即移除，且此操作無法復原。',
                    confirmText: '刪除表格',
                    onConfirm: () => {
                      Transforms.removeNodes(editor, { at: tablePath });
                    },
                  });
                },
              },
            ],
          },
        ]}
      />
      <div ref={scrollRef} className="qdr-table__scrollContainer">
        <TableScrollContext.Provider value={scrollContextValue}>
          <table
            {...attributes}
            ref={(node) => {
              // 合併兩個 refs
              tableRef.current = node;

              if (typeof attributes.ref === 'function') {
                attributes.ref(node);
              } else if (attributes.ref) {
                (attributes.ref as RefObject<HTMLTableElement | null>).current = node;
              }
            }}
            className="qdr-table__main"
            style={{
              minWidth: tableMinWidth,
            }}
          >
            <colgroup>
              {columnWidths.map((width, index) => (
                <col
                  key={index}
                  style={{
                    width: columnWidthToCSS(width),
                    minWidth: columnWidthToCSS(width),
                  }}
                />
              ))}
            </colgroup>
            {children}
          </table>
        </TableScrollContext.Provider>
      </div>
      <div className="qdr-table__size-indicators">
        {firstRowCells?.map((cell, colIndex) => (
          <div
            key={colIndex}
            className="qdr-table__size-indicator"
            style={{
              width: columnWidthToCSS(columnWidths[colIndex]),
              minWidth: columnWidthToCSS(columnWidths[colIndex]),
              transform: cell.pinned ? 'none' : `translateX(-${scrollLeft}px)`,
              zIndex: cell.pinned ? 2 : 1,
            }}
          >
            <div className="qdr-table__size">{columnWidthToCSS(columnWidths[colIndex])}</div>
          </div>
        ))}
      </div>
      {isReachMaximumColumns ? null : (
        <button type="button" onClick={() => addColumn()} title="Add Column" className="qdr-table__add-column">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
      {isReachMaximumRows ? null : (
        <button type="button" onClick={() => addRow()} title="Add Row" className="qdr-table__add-row">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
      {isReachMaximumColumns || isReachMaximumRows ? null : (
        <button type="button" onClick={addColumnAndRow} title="Add Column and Row" className="qdr-table__add-both">
          <Icon icon={Plus} width={20} height={20} className="qdr-table__btn-icon" />
        </button>
      )}
    </div>
  );
}

export default TableMain;
