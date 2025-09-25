import React, { useContext, useRef, useState, useEffect, useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { PARAGRAPH_TYPE, Transforms } from '@quadrats/core';
import { useSlateStatic } from 'slate-react';
import { LIST_TYPES } from '@quadrats/common/list';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon, Portal } from '@quadrats/react/components';
import {
  AddColumnAtLeft,
  AddColumnAtRight,
  AddRowAtBottom,
  AddRowAtTop,
  Drag,
  OrderedList,
  Paragraph,
  Pinned,
  TableRemoveTitle,
  TableSetColumnTitle,
  TableSetRowTitle,
  Trash,
  UnorderedList,
  Unpinned,
} from '@quadrats/icons';
import { TableElement } from '@quadrats/common/table';
import { useTable } from '../hooks/useTable';
import { InlineToolbar, ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';
import { useTableCellFocused, useTableCellPosition, useTableCellTransformContent } from '../hooks/useTableCell';
import { TableScrollContext } from '../contexts/TableScrollContext';

function TableCell(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;
  const {
    tableSelectedOn,
    setTableSelectedOn,
    tableHoveredOn,
    setTableHoveredOn,
    columnCount,
    rowCount,
    isReachMaximumColumns,
    isReachMinimumNormalColumns,
    isReachMinimumBodyRows,
    deleteRow,
    deleteColumn,
    addRow,
    addColumn,
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
    portalContainerRef,
  } = useTable();

  const { isHeader } = useContext(TableHeaderContext);
  const { scrollTop } = useContext(TableScrollContext);
  const editor = useSlateStatic();
  const focused = useTableCellFocused(element, editor);
  const cellPosition = useTableCellPosition(element, editor);
  const transformCellContent = useTableCellTransformContent(element, editor);

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

  // 計算位置相對於 Table 的位置
  useEffect(() => {
    const { current: cell } = cellRef;
    const { current: portalContainer } = portalContainerRef;

    if (!cell || !portalContainer) {
      setToolbarPosition(null);
      setRowButtonPosition(null);
      setColumnButtonPosition(null);

      return;
    }

    const cellRect = cell.getBoundingClientRect();
    const containerRect = portalContainer.getBoundingClientRect();

    // 工具列位置 (針對 focused 狀態)
    if (focused || isSelectionTriggerByMe) {
      setToolbarPosition({
        top: cellRect.top - containerRect.top - 4, // -4px offset
        left: cellRect.left - containerRect.left,
      });
    } else {
      setToolbarPosition(null);
    }

    // 行按鈕位置 (顯示在第一列)
    if (cellPosition.columnIndex === 0) {
      setRowButtonPosition({
        top: Math.min(cellRect.top - containerRect.top + cellRect.height / 2 - 10, 0), // 置中，按鈕高度約 20px
        left: cellRect.left - containerRect.left - 10, // 向左偏移 10px
      });
    } else {
      setRowButtonPosition(null);
    }

    // 列按鈕位置 (顯示在第一行)
    if (cellPosition.rowIndex === 0) {
      setColumnButtonPosition({
        top: cellRect.top - containerRect.top - 10 + scrollTop, // 向上偏移 10px
        left: cellRect.left - containerRect.left + cellRect.width / 2 - 10, // 置中，按鈕寬度約 20px
      });
    } else {
      setColumnButtonPosition(null);
    }
  }, [focused, isSelectionTriggerByMe, cellPosition.columnIndex, cellPosition.rowIndex, portalContainerRef, scrollTop]);

  const TagName = isHeader ? 'th' : 'td';

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
        'qdr-table__cell--top-active': isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === 0),
        'qdr-table__cell--right-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === columnCount - 1),
        'qdr-table__cell--bottom-active':
          isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === rowCount - 1),
        'qdr-table__cell--left-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === 0),
        'qdr-table__cell--is-selection-trigger-by-me': isSelectionTriggerByMe,
      })}
    >
      {children}
      {focused && (
        <Portal getContainer={() => portalContainerRef.current || document.body}>
          <InlineToolbar
            className={'qdr-table__cell__focus-toolbar'}
            style={{
              top: toolbarPosition?.top,
              left: toolbarPosition?.left,
            }}
            iconGroups={[
              {
                icons: [
                  <ToolbarGroupIcon key="typography-change" icon={Paragraph}>
                    <ToolbarIcon
                      icon={Paragraph}
                      onClick={() => {
                        transformCellContent(PARAGRAPH_TYPE);
                      }}
                    />
                    <ToolbarIcon
                      icon={UnorderedList}
                      onClick={() => {
                        transformCellContent(LIST_TYPES.ul);
                      }}
                    />
                    <ToolbarIcon
                      icon={OrderedList}
                      onClick={() => {
                        transformCellContent(LIST_TYPES.ol);
                      }}
                    />
                  </ToolbarGroupIcon>,
                ],
              },
              {
                icons: [
                  {
                    icon: AddRowAtBottom,
                    onClick: () => {
                      addRow({ position: 'bottom', rowIndex: cellPosition.rowIndex });
                    },
                  },
                  {
                    icon: AddRowAtTop,
                    onClick: () => {
                      addRow({ position: 'top', rowIndex: cellPosition.rowIndex });
                    },
                  },
                  {
                    icon: AddColumnAtLeft,
                    disabled: isReachMaximumColumns,
                    onClick: () => {
                      addColumn({
                        position: 'left',
                        columnIndex: cellPosition.columnIndex,
                        treatAsTitle: element.treatAsTitle,
                      });
                    },
                  },
                  {
                    icon: AddColumnAtRight,
                    disabled: isReachMaximumColumns,
                    onClick: () => {
                      addColumn({
                        position: 'right',
                        columnIndex: cellPosition.columnIndex,
                        treatAsTitle: element.treatAsTitle,
                      });
                    },
                  },
                ],
              },
            ]}
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
              top: columnButtonPosition?.top,
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
            iconGroups={[
              {
                icons: (() => {
                  if (tableSelectedOn?.region === 'row') {
                    const removeTitleAction = {
                      icon: TableRemoveTitle,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          moveRowToBody(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const setColumnTitleAction = {
                      icon: TableSetColumnTitle,
                      disabled: isReachMinimumBodyRows,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          moveRowToHeader(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const unpinnedAction = {
                      icon: Unpinned,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          unpinRow(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const pinnedAction = {
                      icon: Pinned,
                      disabled: isReachMinimumBodyRows,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          pinRow(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const actions = [];

                    if (typeof tableSelectedOn.index === 'number' && isRowPinned(tableSelectedOn.index)) {
                      actions.push(unpinnedAction);
                    } else {
                      actions.push(pinnedAction);
                    }

                    if (isHeader) {
                      actions.push(removeTitleAction);
                    } else {
                      actions.push(setColumnTitleAction);
                    }

                    return actions;
                  }

                  if (tableSelectedOn?.region === 'column') {
                    const removeTitleAction = {
                      icon: TableRemoveTitle,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          unsetColumnAsTitle(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const setRowTitleAction = {
                      icon: TableSetRowTitle,
                      disabled: isReachMinimumNormalColumns,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          setColumnAsTitle(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const unpinnedAction = {
                      icon: Unpinned,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          unpinColumn(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const pinnedAction = {
                      icon: Pinned,
                      disabled: isReachMinimumNormalColumns,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          pinColumn(tableSelectedOn.index);
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const actions = [];

                    if (typeof tableSelectedOn.index === 'number' && isColumnPinned(tableSelectedOn.index)) {
                      actions.push(unpinnedAction);
                    } else {
                      actions.push(pinnedAction);
                    }

                    if (element.treatAsTitle) {
                      actions.push(removeTitleAction);
                    } else {
                      actions.push(setRowTitleAction);
                    }

                    return actions;
                  }

                  return [];
                })(),
              },
              {
                icons: (() => {
                  if (tableSelectedOn?.region === 'row') {
                    const addRowAtBottomAction = {
                      icon: AddRowAtBottom,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          addRow({ position: 'bottom', rowIndex: tableSelectedOn.index });
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const addRowAtTopAction = {
                      icon: AddRowAtTop,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          addRow({ position: 'top', rowIndex: tableSelectedOn.index });
                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    return [addRowAtBottomAction, addRowAtTopAction];
                  }

                  if (tableSelectedOn?.region === 'column') {
                    const addColumnAtLeftAction = {
                      icon: AddColumnAtLeft,
                      disabled: isReachMaximumColumns,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          addColumn({
                            position: 'left',
                            columnIndex: tableSelectedOn.index,
                            treatAsTitle: element.treatAsTitle,
                          });

                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    const addColumnAtRightAction = {
                      icon: AddColumnAtRight,
                      disabled: isReachMaximumColumns,
                      onClick: () => {
                        if (typeof tableSelectedOn.index === 'number') {
                          addColumn({
                            position: 'right',
                            columnIndex: tableSelectedOn.index,
                            treatAsTitle: element.treatAsTitle,
                          });

                          setTableSelectedOn(undefined);
                        }
                      },
                    };

                    return [addColumnAtLeftAction, addColumnAtRightAction];
                  }

                  return [];
                })(),
              },
              {
                icons: [
                  {
                    icon: Trash,
                    className: 'qdr-table__delete',
                    onClick: () => {
                      // Determine whether to delete row or column based on current selection
                      if (tableSelectedOn?.region === 'row' && typeof tableSelectedOn.index === 'number') {
                        deleteRow(tableSelectedOn.index);
                        setTableSelectedOn(undefined); // Clear selection after deletion
                      } else if (tableSelectedOn?.region === 'column' && typeof tableSelectedOn.index === 'number') {
                        deleteColumn(tableSelectedOn.index);
                        setTableSelectedOn(undefined); // Clear selection after deletion
                      }
                    },
                  },
                ],
              },
            ]}
          />
        </Portal>
      ) : null}
    </TagName>
  );
}

export default TableCell;
