import React, { useContext, useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps, useSlateStatic } from '@quadrats/react';
import { Element, Node } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon } from '@quadrats/react/components';
import { AddColumnAtLeft, AddColumnAtRight, AddRowAtBottom, AddRowAtTop, Drag, Trash } from '@quadrats/icons';
import { TABLE_ROW_TYPE, TABLE_HEADER_TYPE, TABLE_MAIN_TYPE, TABLE_BODY_TYPE } from '@quadrats/common/table';
import { useTable } from '../hooks/useTable';
import { InlineToolbar } from '@quadrats/react/toolbar';

function TableCell(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children, element } = props;
  const { tableSelectedOn, setTableSelectedOn, columnCount, rowCount, deleteRow, deleteColumn } = useTable();
  const { isHeader } = useContext(TableHeaderContext);
  const editor = useSlateStatic();
  const cellPath = ReactEditor.findPath(editor, element);

  const cellPosition = useMemo(() => {
    try {
      const rowPath = cellPath.slice(0, -1);
      const rowNode = Node.get(editor, rowPath);

      if (!Element.isElement(rowNode)) {
        return { columnIndex: -1, rowIndex: -1 };
      }

      const columnIndex = cellPath[cellPath.length - 1];
      let rowIndex = -1;

      if (rowNode.type.includes(TABLE_ROW_TYPE)) {
        const tableRowWrapperPath = rowPath.slice(0, -1);
        const tableRowWrapperNode = Node.get(editor, tableRowWrapperPath);

        if (
          !Element.isElement(tableRowWrapperNode) ||
          ![TABLE_BODY_TYPE, TABLE_HEADER_TYPE].includes(tableRowWrapperNode.type)
        ) {
          return { columnIndex, rowIndex: -1 };
        }

        const tableMainPath = tableRowWrapperPath.slice(0, -1);
        const tableMainNode = Node.get(editor, tableMainPath);

        if (!Element.isElement(tableMainNode) || !tableMainNode.type.includes(TABLE_MAIN_TYPE)) {
          return { columnIndex, rowIndex: -1 };
        }

        const rowIndexInWrapper = rowPath[rowPath.length - 1];

        if (tableRowWrapperNode.type.includes(TABLE_HEADER_TYPE)) {
          // This is a header row, rowIndex is just its position within header
          rowIndex = rowIndexInWrapper;
        } else {
          // This is a body row, rowIndex should account for total header rows
          const headerElement = tableMainNode.children.find(
            (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
          );

          let totalHeaderRows = 0;

          if (headerElement && Element.isElement(headerElement)) {
            totalHeaderRows = headerElement.children.filter(
              (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
            ).length;
          }

          rowIndex = rowIndexInWrapper + totalHeaderRows;
        }
      }

      return { columnIndex, rowIndex };
    } catch (error) {
      console.warn('Error calculating cell position:', error);

      return { columnIndex: -1, rowIndex: -1 };
    }
  }, [editor, cellPath]);

  const TagName = isHeader ? 'th' : 'td';

  const isSelectedInSameRow = tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex;
  const isSelectedInSameColumn =
    tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex;

  const isSelectionTriggerByMe =
    (isSelectedInSameRow && cellPosition.columnIndex === 0) || (isSelectedInSameColumn && cellPosition.rowIndex === 0);

  return (
    <TagName
      {...attributes}
      className={clsx('qdr-table__cell', {
        'qdr-table__cell--header': isHeader,
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
            'qdr-table__cell-row-action--active': isSelectedInSameRow,
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
            'qdr-table__cell-column-action--active': isSelectedInSameColumn,
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
                  const addRowAtBottomAction = {
                    icon: AddRowAtBottom,
                    onClick: () => {
                      /** @TODO add row at bottom */
                    },
                  };

                  const addRowAtTopAction = {
                    icon: AddRowAtTop,
                    onClick: () => {
                      /** @TODO add row at top */
                    },
                  };

                  if (cellPosition.rowIndex === 0) {
                    return [addRowAtBottomAction];
                  }

                  if (cellPosition.rowIndex === rowCount - 1) {
                    return [addRowAtTopAction];
                  }

                  return [addRowAtBottomAction, addRowAtTopAction];
                }

                if (tableSelectedOn?.region === 'column') {
                  const addColumnAtLeftAction = {
                    icon: AddColumnAtLeft,
                    onClick: () => {
                      /** @TODO add column at left */
                    },
                  };

                  const addColumnAtRightAction = {
                    icon: AddColumnAtRight,
                    onClick: () => {
                      /** @TODO add column at right */
                    },
                  };

                  if (cellPosition.columnIndex === 0) {
                    return [addColumnAtRightAction];
                  }

                  if (cellPosition.columnIndex === columnCount - 1) {
                    return [addColumnAtLeftAction];
                  }

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
