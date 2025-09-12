import React, { useMemo } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { Element } from '@quadrats/core';
import { TableContext } from '../contexts/TableContext';
import { RenderTableElementProps, TableContextType } from '../typings';
import {
  TABLE_BODY_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_MAX_COLUMNS,
  TABLE_MAX_ROWS,
  TABLE_ROW_TYPE,
} from '@quadrats/common/table';
import { useTableActions } from '../hooks/useTableActions';
import { Icon } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { useTableStates } from '../hooks/useTableStates';

function Table({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderTableElementProps['element'];
}) {
  const { addColumn, addRow, addColumnAndRow, deleteRow, deleteColumn } = useTableActions(element);
  const { tableSelectedOn, setTableSelectedOn, tableHoveredOn, setTableHoveredOn } = useTableStates();

  const { columnCount, rowCount } = useMemo(() => {
    const childElements = element.children.filter((child) => Element.isElement(child));

    const tableMainElement = childElements.find((child) => child.type.includes(TABLE_MAIN_TYPE));

    if (!tableMainElement) {
      return { columnCount: 0, rowCount: 0 };
    }

    const tableMainChildren = tableMainElement.children.filter((child) => Element.isElement(child));
    const headerElement = tableMainChildren.find((child) => child.type.includes(TABLE_HEADER_TYPE));
    const headerRowElements = headerElement
      ? headerElement.children.filter((child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE))
      : [];

    const bodyElement = tableMainChildren.find((child) => child.type.includes(TABLE_BODY_TYPE));
    const bodyRowElements = bodyElement
      ? bodyElement.children.filter((child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE))
      : [];

    const cols =
      bodyRowElements.length > 0 && Element.isElement(bodyRowElements[0]) ? bodyRowElements[0].children.length : 0;

    const rows = headerRowElements.length + bodyRowElements.length;

    return {
      columnCount: cols,
      rowCount: rows,
    };
  }, [element]);

  const isReachMaximumColumns: TableContextType['isReachMaximumColumns'] = useMemo(() => {
    return columnCount >= TABLE_MAX_COLUMNS;
  }, [columnCount]);

  const isReachMaximumRows: TableContextType['isReachMaximumRows'] = useMemo(() => {
    return rowCount >= TABLE_MAX_ROWS;
  }, [rowCount]);

  const contextValue: TableContextType = useMemo(
    () => ({
      tableElement: element,
      columnCount,
      rowCount,
      addColumn,
      addRow,
      addColumnAndRow,
      deleteRow,
      deleteColumn,
      isReachMaximumColumns,
      isReachMaximumRows,
      tableSelectedOn,
      setTableSelectedOn,
      tableHoveredOn,
      setTableHoveredOn,
    }),
    [
      element,
      columnCount,
      rowCount,
      addColumn,
      addRow,
      addColumnAndRow,
      deleteRow,
      deleteColumn,
      isReachMaximumColumns,
      isReachMaximumRows,
      tableSelectedOn,
      setTableSelectedOn,
      tableHoveredOn,
      setTableHoveredOn,
    ],
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div {...attributes} className="qdr-table">
        {children}
        <button
          type="button"
          onClick={() => setTableSelectedOn((prev) => (prev?.region === 'table' ? undefined : { region: 'table' }))}
          className="qdr-table__selection"
          title={tableSelectedOn?.region === 'table' ? 'Deselect Table' : 'Select Table'}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      </div>
    </TableContext.Provider>
  );
}

export default Table;
