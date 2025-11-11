import React, { useMemo } from 'react';
import {
  AddColumnAtLeft,
  AddColumnAtRight,
  AddRowAtBottom,
  AddRowAtTop,
  AlignCenter,
  AlignLeft,
  AlignRight,
  OrderedList,
  Paragraph,
  Pinned,
  TableMoveDown,
  TableMoveLeft,
  TableMoveRight,
  TableMoveUp,
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
import { useTableStateContext } from './useTableStateContext';
import { ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';
import { useTableCellAlign, useTableCellAlignStatus } from './useTableCell';
import { useSlateStatic } from 'slate-react';

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
  const editor = useSlateStatic();
  const { tableSelectedOn, setTableSelectedOn } = useTableStateContext();
  const {
    tableElement,
    columnCount,
    rowCount,
    isReachMaximumColumns,
    isReachMinimumNormalColumns,
    isReachMinimumBodyRows,
    isColumnPinned,
    isRowPinned,
  } = useTableMetadata();

  const setAlign = useTableCellAlign(tableElement, editor);
  const getAlign = useTableCellAlignStatus(tableElement, editor);

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
    moveOrSwapRow,
    moveOrSwapColumn,
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
          isReachMaximumColumns
            ? undefined
            : {
                icon: AddColumnAtLeft,
                onClick: () => {
                  addColumn({
                    position: 'left',
                    columnIndex: cellPosition.columnIndex,
                  });
                },
              },
          isReachMaximumColumns
            ? undefined
            : {
                icon: AddColumnAtRight,
                onClick: () => {
                  addColumn({
                    position: 'right',
                    columnIndex: cellPosition.columnIndex,
                  });
                },
              },
        ].filter((i) => i !== undefined),
      },
    ];
  }, [transformCellContent, addRow, addColumn, cellPosition, isReachMaximumColumns, getCurrentIcon]);

  // Row actions
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

    const setColumnTitleAction = isReachMinimumBodyRows
      ? undefined
      : {
          icon: TableSetColumnTitle,
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

    const pinnedAction =
      isReachMinimumBodyRows && !isHeader
        ? undefined
        : {
            icon: Pinned,
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
      if (pinnedAction) actions.push(pinnedAction);
    }

    if (isHeader) {
      actions.push(removeTitleAction);
    } else {
      if (setColumnTitleAction) actions.push(setColumnTitleAction);
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

  // Column actions
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

    const setRowTitleAction = isReachMinimumNormalColumns
      ? undefined
      : {
          icon: TableSetRowTitle,
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

    const pinnedAction =
      isReachMinimumNormalColumns && !element.treatAsTitle
        ? undefined
        : {
            icon: Pinned,
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
      if (pinnedAction) actions.push(pinnedAction);
    }

    if (element.treatAsTitle) {
      actions.push(removeTitleAction);
    } else {
      if (setRowTitleAction) actions.push(setRowTitleAction);
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

  // Column align actions
  const columnAlignActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'column' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    // 獲取當前 column 的 align 狀態
    const currentAlign = getAlign('column', tableSelectedOn.index);

    // 根據當前 align 狀態選擇對應的 icon
    const getCurrentAlignIcon = () => {
      switch (currentAlign) {
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

    return [
      <ToolbarGroupIcon key="align-change" icon={getCurrentAlignIcon()}>
        <ToolbarIcon
          icon={AlignLeft}
          onClick={() => {
            if (typeof tableSelectedOn.index === 'number') {
              setAlign('left', 'column', tableSelectedOn.index);
              setTableSelectedOn(undefined);
            }
          }}
        />
        <ToolbarIcon
          icon={AlignCenter}
          onClick={() => {
            if (typeof tableSelectedOn.index === 'number') {
              setAlign('center', 'column', tableSelectedOn.index);
              setTableSelectedOn(undefined);
            }
          }}
        />
        <ToolbarIcon
          icon={AlignRight}
          onClick={() => {
            if (typeof tableSelectedOn.index === 'number') {
              setAlign('right', 'column', tableSelectedOn.index);
              setTableSelectedOn(undefined);
            }
          }}
        />
      </ToolbarGroupIcon>,
    ];
  }, [tableSelectedOn, setAlign, setTableSelectedOn, getAlign]);

  // Row add actions
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

  // Column add actions
  const columnAddActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'column' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    return [
      isReachMaximumColumns
        ? undefined
        : {
            icon: AddColumnAtLeft,
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
      isReachMaximumColumns
        ? undefined
        : {
            icon: AddColumnAtRight,
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
    ].filter((i) => i !== undefined);
  }, [tableSelectedOn, addColumn, setTableSelectedOn, isReachMaximumColumns]);

  // Row move actions
  const rowMoveActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'row' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    const rowIndex = tableSelectedOn.index;

    // 從 tableElement 獲取 header 和 body 的資訊
    const tableMainElement = tableElement.children.find(
      (child) => Element.isElement(child) && child.type.includes('table_main'),
    );

    if (!tableMainElement || !Element.isElement(tableMainElement)) {
      return null;
    }

    const tableHeaderElement = tableMainElement.children.find(
      (child) => Element.isElement(child) && child.type.includes('table_header'),
    );

    const headerRowCount =
      tableHeaderElement && Element.isElement(tableHeaderElement) ? tableHeaderElement.children.length : 0;

    // 判斷當前列是在 header 還是 body 中
    const currentInHeader = rowIndex < headerRowCount;

    // 判斷上方和下方是否可以互換
    const canMoveUp = rowIndex > 0; // 不在第一列
    const canMoveDown = rowIndex < rowCount - 1; // 不在最後一列

    // 檢查目標位置是否在相同的容器中（header 或 body）
    const targetUpInHeader = rowIndex - 1 < headerRowCount;
    const targetDownInHeader = rowIndex + 1 < headerRowCount;

    // 標題列只能與標題列互換，一般列只能與一般列互換
    const canSwapUp = canMoveUp && currentInHeader === targetUpInHeader;
    const canSwapDown = canMoveDown && currentInHeader === targetDownInHeader;

    return [
      canSwapDown
        ? {
            icon: TableMoveDown,
            onClick: () => {
              if (typeof tableSelectedOn.index === 'number') {
                moveOrSwapRow(tableSelectedOn.index, tableSelectedOn.index + 1, 'swap');
                setTableSelectedOn(undefined);
              }
            },
          }
        : undefined,
      canSwapUp
        ? {
            icon: TableMoveUp,
            onClick: () => {
              if (typeof tableSelectedOn.index === 'number') {
                moveOrSwapRow(tableSelectedOn.index, tableSelectedOn.index - 1, 'swap');
                setTableSelectedOn(undefined);
              }
            },
          }
        : undefined,
    ].filter((i) => i !== undefined);
  }, [tableSelectedOn, setTableSelectedOn, rowCount, tableElement, moveOrSwapRow]);

  // Column move actions
  const columnMoveActions = useMemo(() => {
    if (tableSelectedOn?.region !== 'column' || typeof tableSelectedOn.index !== 'number') {
      return null;
    }

    const columnIndex = tableSelectedOn.index;

    // 檢查當前行是否為標題行
    const currentIsTitle = !!element.treatAsTitle;

    // 判斷左右是否可以移動
    const canMoveLeft = columnIndex > 0;
    const canMoveRight = columnIndex < columnCount - 1;

    // 檢查相鄰行是否為相同類型（都是標題行或都不是標題行）
    const checkAdjacentColumnType = (adjacentIndex: number): boolean => {
      // 從 tableElement 中獲取相鄰行的 treatAsTitle 狀態
      const tableMainElement = tableElement.children.find(
        (child) => Element.isElement(child) && child.type.includes('table_main'),
      );

      if (!tableMainElement || !Element.isElement(tableMainElement)) {
        return false;
      }

      const tableBodyElement = tableMainElement.children.find(
        (child) => Element.isElement(child) && child.type.includes('table_body'),
      );

      if (!tableBodyElement || !Element.isElement(tableBodyElement)) {
        return false;
      }

      // 從 body 的第一列獲取相鄰 cell 的 treatAsTitle 屬性
      const firstRow = tableBodyElement.children[0];

      if (!Element.isElement(firstRow)) {
        return false;
      }

      const adjacentCell = firstRow.children[adjacentIndex];

      if (!Element.isElement(adjacentCell)) {
        return false;
      }

      return !!adjacentCell.treatAsTitle;
    };

    // 標題行只能與標題行互換，一般行只能與一般行互換
    const canSwapLeft = canMoveLeft && currentIsTitle === checkAdjacentColumnType(columnIndex - 1);
    const canSwapRight = canMoveRight && currentIsTitle === checkAdjacentColumnType(columnIndex + 1);

    return [
      canSwapRight
        ? {
            icon: TableMoveRight,
            onClick: () => {
              if (typeof tableSelectedOn.index === 'number') {
                moveOrSwapColumn(tableSelectedOn.index, tableSelectedOn.index + 1, 'swap');
                setTableSelectedOn(undefined);
              }
            },
          }
        : undefined,
      canSwapLeft
        ? {
            icon: TableMoveLeft,
            onClick: () => {
              if (typeof tableSelectedOn.index === 'number') {
                moveOrSwapColumn(tableSelectedOn.index, tableSelectedOn.index - 1, 'swap');
                setTableSelectedOn(undefined);
              }
            },
          }
        : undefined,
    ].filter((i) => i !== undefined);
  }, [tableSelectedOn, setTableSelectedOn, columnCount, element.treatAsTitle, tableElement, moveOrSwapColumn]);

  // Delete actions
  const deleteActions = useMemo(() => {
    // 當選中 row 時，檢查是否為最後一行
    if (tableSelectedOn?.region === 'row' && typeof tableSelectedOn.index === 'number') {
      // 如果只剩一行，不顯示刪除按鈕
      if (isReachMinimumBodyRows && !isHeader) {
        return [];
      }
    }

    // 當選中 column 時，檢查是否為最後一列
    if (tableSelectedOn?.region === 'column' && typeof tableSelectedOn.index === 'number') {
      // 如果只剩一列（考慮 title columns），不顯示刪除按鈕
      if (columnCount <= 1) {
        return [];
      }
    }

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
  }, [tableSelectedOn, deleteRow, deleteColumn, setTableSelectedOn, isReachMinimumBodyRows, isHeader, columnCount]);

  // Inline toolbar icon groups - 當選中行/列時顯示的完整工具列
  const inlineToolbarIconGroups = useMemo(() => {
    return [
      {
        icons: rowActions || columnActions || [],
      },
      {
        icons: columnAlignActions || [],
      },
      {
        icons: rowAddActions || columnAddActions || [],
      },
      {
        icons: rowMoveActions || columnMoveActions || [],
      },
      {
        icons: deleteActions,
      },
    ];
  }, [
    rowActions,
    columnActions,
    columnAlignActions,
    rowAddActions,
    columnAddActions,
    rowMoveActions,
    columnMoveActions,
    deleteActions,
  ]);

  return {
    focusToolbarIconGroups,
    inlineToolbarIconGroups,
  };
}
