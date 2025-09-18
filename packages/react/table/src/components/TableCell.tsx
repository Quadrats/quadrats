import React, { useContext } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon } from '@quadrats/react/components';
import {
  AddColumnAtLeft,
  AddColumnAtRight,
  AddRowAtBottom,
  AddRowAtTop,
  Drag,
  TableRemoveTitle,
  TableSetColumnTitle,
  TableSetRowTitle,
  Trash,
} from '@quadrats/icons';
import { TableElement } from '@quadrats/common/table';
import { useTable } from '../hooks/useTable';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { useTableCellFocused, useTableCellPosition } from '../hooks/useTableCell';

function TableCell(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;
  const {
    tableSelectedOn,
    setTableSelectedOn,
    tableHoveredOn,
    setTableHoveredOn,
    columnCount,
    rowCount,
    deleteRow,
    deleteColumn,
    addRow,
    addColumn,
    moveRowToBody,
    moveRowToHeader,
    unsetColumnAsTitle,
    setColumnAsTitle,
  } = useTable();

  const { isHeader } = useContext(TableHeaderContext);
  const focused = useTableCellFocused(element);
  const cellPosition = useTableCellPosition(element);

  const TagName = isHeader ? 'th' : 'td';

  const isSelectedInSameRow = tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex;
  const isSelectedInSameColumn =
    tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex;

  const isSelectionTriggerByMe =
    (isSelectedInSameRow && cellPosition.columnIndex === 0) || (isSelectedInSameColumn && cellPosition.rowIndex === 0);

  return (
    <TagName
      {...attributes}
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
        'qdr-table__cell--focused': focused,
      })}
    >
      {children}
      <InlineToolbar
        className={'qdr-table__cell__focus-toolbar'}
        iconGroups={[
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
      {cellPosition.columnIndex === 0 && (
        <button
          type="button"
          contentEditable={false}
          onClick={() =>
            setTableSelectedOn((prev) => {
              if (prev?.region === 'row' && prev.index === cellPosition.rowIndex) {
                return undefined;
              }

              return { region: 'row', index: cellPosition.rowIndex };
            })
          }
          className={clsx('qdr-table__cell-row-action', {
            'qdr-table__cell-row-action--active':
              isSelectedInSameRow || (tableHoveredOn?.rowIndex === cellPosition.rowIndex && !tableSelectedOn),
          })}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      )}
      {cellPosition.rowIndex === 0 && (
        <button
          type="button"
          contentEditable={false}
          onClick={() =>
            setTableSelectedOn((prev) => {
              if (prev?.region === 'column' && prev.index === cellPosition.columnIndex) {
                return undefined;
              }

              return { region: 'column', index: cellPosition.columnIndex };
            })
          }
          className={clsx('qdr-table__cell-column-action', {
            'qdr-table__cell-column-action--active':
              isSelectedInSameColumn || (tableHoveredOn?.columnIndex === cellPosition.columnIndex && !tableSelectedOn),
          })}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      )}
      {cellPosition.columnIndex === 0 || cellPosition.rowIndex === 0 ? (
        <InlineToolbar
          className="qdr-table__cell__inline-table-toolbar"
          iconGroups={[
            {
              icons: (() => {
                if (tableSelectedOn?.region === 'row') {
                  return isHeader
                    ? [
                        {
                          icon: TableRemoveTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              moveRowToBody(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ]
                    : [
                        {
                          icon: TableSetColumnTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              moveRowToHeader(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ];
                }

                if (tableSelectedOn?.region === 'column') {
                  return element.treatAsTitle
                    ? [
                        {
                          icon: TableRemoveTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              unsetColumnAsTitle(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ]
                    : [
                        {
                          icon: TableSetRowTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              setColumnAsTitle(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ];
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
      ) : null}
    </TagName>
  );
}

export default TableCell;
