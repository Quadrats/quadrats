import React, { useMemo } from 'react';
import {
  AddColumnAtLeft,
  AddColumnAtRight,
  AddRowAtBottom,
  AddRowAtTop,
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
import { PARAGRAPH_TYPE, Element } from '@quadrats/core';
import { LIST_TYPES } from '@quadrats/common/list';
import { TableElement } from '@quadrats/common/table';
import { useTableActionsContext } from './useTableActionsContext';
import { useTableMetadata } from './useTableMetadata';
import { useTableState } from './useTableState';
import { ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';

interface Position {
  columnIndex: number;
  rowIndex: number;
}

interface UseTableCellToolbarActionsParams {
  element: TableElement;
  cellPosition: Position;
  isHeader: boolean;
  transformCellContent: (type: string) => void;
}

/**
 * 將所有與 toolbar icons 相關的邏輯集中管理
 */
export function useTableCellToolbarActions({
  element,
  cellPosition,
  isHeader,
  transformCellContent,
}: UseTableCellToolbarActionsParams) {
  const { tableSelectedOn, setTableSelectedOn } = useTableState();
  const { isReachMaximumColumns, isReachMinimumNormalColumns, isReachMinimumBodyRows, isColumnPinned, isRowPinned } =
    useTableMetadata();

  const {
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
  } = useTableActionsContext();

  // 獲取當前 cell 內容的類型（用於顯示對應的 icon）
  const getCurrentContentType = useMemo(() => {
    // 檢查 cell 的第一個 child 的類型
    if (element.children && element.children.length > 0) {
      const firstChild = element.children[0];

      if (Element.isElement(firstChild)) {
        const childType = firstChild.type;

        // 檢查是否為 list 類型
        if (childType === LIST_TYPES.ul) {
          return LIST_TYPES.ul;
        }

        if (childType === LIST_TYPES.ol) {
          return LIST_TYPES.ol;
        }

        // 檢查是否為 paragraph（預設）
        if (childType === PARAGRAPH_TYPE) {
          return PARAGRAPH_TYPE;
        }
      }
    }

    // 預設返回 paragraph
    return PARAGRAPH_TYPE;
  }, [element.children]);

  // 根據當前內容類型選擇對應的 icon
  const getCurrentIcon = useMemo(() => {
    if (getCurrentContentType === LIST_TYPES.ul) {
      return UnorderedList;
    }

    if (getCurrentContentType === LIST_TYPES.ol) {
      return OrderedList;
    }

    return Paragraph;
  }, [getCurrentContentType]);

  // Focus toolbar - 當 cell 被 focus 時顯示的工具列
  const focusToolbarIconGroups = useMemo(() => {
    return [
      {
        icons: [
          <ToolbarGroupIcon key="typography-change" icon={getCurrentIcon}>
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
              });
            },
          },
        ],
      },
    ];
  }, [transformCellContent, addRow, addColumn, cellPosition, isReachMaximumColumns, getCurrentIcon]);

  // Row actions - 當選中某一行時顯示的操作
  const rowActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'row' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

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
          unpinRow();
          setTableSelectedOn(undefined);
        }
      },
    };

    const pinnedAction = {
      icon: Pinned,
      disabled: isReachMinimumBodyRows && !isHeader,
      onClick: () => {
        if (typeof tableSelectedOn.index === 'number') {
          pinRow(tableSelectedOn.index);
          setTableSelectedOn(undefined);
        }
      },
    };

    const actions = [];
    const rowIsPinned = isRowPinned(tableSelectedOn.index);

    if (rowIsPinned) {
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
  }, [
    tableSelectedOn,
    moveRowToBody,
    moveRowToHeader,
    unpinRow,
    pinRow,
    setTableSelectedOn,
    isReachMinimumBodyRows,
    isHeader,
    isRowPinned,
  ]);

  // Column actions - 當選中某一列時顯示的操作
  const columnActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'column' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

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
          unpinColumn();
          setTableSelectedOn(undefined);
        }
      },
    };

    const pinnedAction = {
      icon: Pinned,
      disabled: isReachMinimumNormalColumns && !element.treatAsTitle,
      onClick: () => {
        if (typeof tableSelectedOn.index === 'number') {
          pinColumn(tableSelectedOn.index);
          setTableSelectedOn(undefined);
        }
      },
    };

    const actions = [];
    const columnIsPinned = isColumnPinned(tableSelectedOn.index);

    if (columnIsPinned) {
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
  }, [
    tableSelectedOn,
    unsetColumnAsTitle,
    setColumnAsTitle,
    unpinColumn,
    pinColumn,
    setTableSelectedOn,
    isReachMinimumNormalColumns,
    element.treatAsTitle,
    isColumnPinned,
  ]);

  // Row add actions - 添加行的操作
  const rowAddActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'row' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    return [
      {
        icon: AddRowAtBottom,
        onClick: () => {
          if (typeof tableSelectedOn.index === 'number') {
            addRow({ position: 'bottom', rowIndex: tableSelectedOn.index });
            setTableSelectedOn(undefined);
          }
        },
      },
      {
        icon: AddRowAtTop,
        onClick: () => {
          if (typeof tableSelectedOn.index === 'number') {
            addRow({ position: 'top', rowIndex: tableSelectedOn.index });
            setTableSelectedOn(undefined);
          }
        },
      },
    ];
  }, [tableSelectedOn, addRow, setTableSelectedOn]);

  // Column add actions - 添加列的操作
  const columnAddActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'column' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    return [
      {
        icon: AddColumnAtLeft,
        disabled: isReachMaximumColumns,
        onClick: () => {
          if (typeof tableSelectedOn.index === 'number') {
            addColumn({
              position: 'left',
              columnIndex: tableSelectedOn.index,
            });

            setTableSelectedOn(undefined);
          }
        },
      },
      {
        icon: AddColumnAtRight,
        disabled: isReachMaximumColumns,
        onClick: () => {
          if (typeof tableSelectedOn.index === 'number') {
            addColumn({
              position: 'right',
              columnIndex: tableSelectedOn.index,
            });

            setTableSelectedOn(undefined);
          }
        },
      },
    ];
  }, [tableSelectedOn, addColumn, setTableSelectedOn, isReachMaximumColumns]);

  // Delete actions - 刪除行/列的操作
  const deleteActions = useMemo(() => {
    return [
      {
        icon: Trash,
        className: 'qdr-table__delete',
        onClick: () => {
          if (tableSelectedOn?.region === 'row' && typeof tableSelectedOn.index === 'number') {
            deleteRow(tableSelectedOn.index);
            setTableSelectedOn(undefined);
          } else if (tableSelectedOn?.region === 'column' && typeof tableSelectedOn.index === 'number') {
            deleteColumn(tableSelectedOn.index);
            setTableSelectedOn(undefined);
          }
        },
      },
    ];
  }, [tableSelectedOn, deleteRow, deleteColumn, setTableSelectedOn]);

  // Inline toolbar icon groups - 當選中行/列時顯示的完整工具列
  const inlineToolbarIconGroups = useMemo(() => {
    return [
      {
        icons: rowActions || columnActions || [],
      },
      {
        icons: rowAddActions || columnAddActions || [],
      },
      {
        icons: deleteActions,
      },
    ];
  }, [rowActions, columnActions, rowAddActions, columnAddActions, deleteActions]);

  return {
    focusToolbarIconGroups,
    inlineToolbarIconGroups,
  };
}
