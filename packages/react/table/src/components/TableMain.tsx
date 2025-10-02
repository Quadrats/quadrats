import React, { useEffect, useMemo, useRef, useState } from 'react';
import clsx from 'clsx';
import { ReactEditor, RenderElementProps, useModal, useSlateStatic } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { AlignCenter, AlignLeft, AlignRight, Plus, Trash } from '@quadrats/icons';
import { useTableActionsContext } from '../hooks/useTableActionsContext';
import { useTableMetadata } from '../hooks/useTableMetadata';
import { useTableState } from '../hooks/useTableState';
import { InlineToolbar, ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';
import { Transforms } from 'slate';
import { TableElement } from '@quadrats/common/table';
import { TableScrollContext } from '../contexts/TableScrollContext';
import { useTableCellAlign, useTableCellAlignStatus } from '../hooks/useTableCell';
import { getTableElements, getColumnWidths, columnWidthToCSS, getColumnWidthDisplay } from '../utils/helper';

function TableMain(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  const { setConfirmModalConfig } = useModal();
  const editor = useSlateStatic();

  const { addColumn, addRow, addColumnAndRow } = useTableActionsContext();
  const { isReachMaximumColumns, isReachMaximumRows, tableElement } = useTableMetadata();
  const { tableSelectedOn } = useTableState();

  // sizing
  const { tableBodyElement } = getTableElements(tableElement);
  const firstRowCells = tableBodyElement?.children[0].children;

  // 獲取欄位寬度
  const columnWidths = useMemo(() => getColumnWidths(tableElement), [tableElement]);

  // Table align functions
  const setAlign = useTableCellAlign(tableElement, editor);
  const getAlign = useTableCellAlignStatus(tableElement, editor);

  const tablePath = ReactEditor.findPath(editor, tableElement);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState<number>(0);

  useEffect(() => {
    const { current: scrollContainer } = scrollRef;

    if (!scrollContainer) return;

    const handleScroll = () => {
      setScrollTop(scrollContainer.scrollTop);
    };

    scrollContainer.addEventListener('scroll', handleScroll, false);

    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll, false);
    };
  }, []);

  const scrollContextValue = useMemo(() => ({ scrollTop, scrollRef }), [scrollTop, scrollRef]);

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
          <table {...attributes} className="qdr-table__main">
            <colgroup>
              {columnWidths.map((width, index) => (
                <col key={index} style={{ width: columnWidthToCSS(width) }} />
              ))}
            </colgroup>
            {children}
          </table>
        </TableScrollContext.Provider>
      </div>
      <div className="qdr-table__size-indicators">
        {firstRowCells?.map((_, colIndex) => (
          <div key={colIndex} className="qdr-table__size-indicator">
            <div className="qdr-table__size">{getColumnWidthDisplay(columnWidths[colIndex])}</div>
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
