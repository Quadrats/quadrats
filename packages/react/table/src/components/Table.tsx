import React, { useMemo, useCallback } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { RenderElementProps } from '@quadrats/react';
import { Element, Node } from '@quadrats/core';
import { TableContext } from '../contexts/TableContext';
import { RenderTableElementProps, TableRowData, TableContextType } from '../typings';
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

const columnHelper = createColumnHelper<TableRowData>();

function Table({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderTableElementProps['element'];
}) {
  const { addColumn, addRow, addColumnAndRow } = useTableActions(element);
  const { tableSelectedOn, setTableSelectedOn } = useTableStates();

  const { tableData, columnCount, rowCount, slateNodeMap } = useMemo(() => {
    const childElements = element.children.filter((child) => Element.isElement(child));

    const tableMainElement = childElements.find((child) => child.type.includes(TABLE_MAIN_TYPE));

    if (!tableMainElement) {
      return { tableData: [], columnCount: 0, rowCount: 0, slateNodeMap: new Map() };
    }

    const tableMainChildren = tableMainElement.children.filter((child) => Element.isElement(child));
    const headerElement = tableMainChildren.find((child) => child.type.includes(TABLE_HEADER_TYPE));
    const bodyElement = tableMainChildren.find((child) => child.type.includes(TABLE_BODY_TYPE));
    const rowElements = bodyElement
      ? bodyElement.children.filter((child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE))
      : [];

    const cols = rowElements.length > 0 && Element.isElement(rowElements[0]) ? rowElements[0].children.length : 0;
    const rows = rowElements.length + (headerElement ? 1 : 0);

    const nodeMap = new Map<Node, { rowIndex: number; columnIndex: number; isHeader: boolean }>();

    const data: TableRowData[] = [];

    if (headerElement) {
      const headerRow: TableRowData = {
        _rowIndex: 0,
        _isHeader: true,
        _slateNode: headerElement,
        _rowId: 'header_0',
      };

      headerElement.children.forEach((cell: Node, index: number) => {
        const columnId = `col_${index}`;

        headerRow[columnId] = cell;

        nodeMap.set(cell, {
          rowIndex: 0,
          columnIndex: index,
          isHeader: true,
        });
      });

      data.push(headerRow);
    }

    rowElements.forEach((rowElement, rowIndex) => {
      if (!Element.isElement(rowElement)) return;

      const actualRowIndex = rowIndex + (headerElement ? 1 : 0);
      const row: TableRowData = {
        _rowIndex: actualRowIndex,
        _isHeader: false,
        _slateNode: rowElement,
        _rowId: `row_${actualRowIndex}`,
      };

      rowElement.children.forEach((cell: Node, cellIndex: number) => {
        const columnId = `col_${cellIndex}`;

        row[columnId] = cell;

        nodeMap.set(cell, {
          rowIndex: actualRowIndex,
          columnIndex: cellIndex,
          isHeader: false,
        });
      });

      data.push(row);
    });

    return {
      tableData: data,
      columnCount: cols,
      rowCount: rows,
      slateNodeMap: nodeMap,
    };
  }, [element]);

  const columns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, index) =>
      columnHelper.accessor(`col_${index}`, {
        id: `col_${index}`,
        header: `Column ${index + 1}`,
        cell: (info) => info.getValue(),
      }),
    );
  }, [columnCount]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._rowId,
  });

  const getCellPosition: TableContextType['getCellPosition'] = useCallback(
    (targetNode) => {
      const nodeInfo = slateNodeMap.get(targetNode);

      if (!nodeInfo) return null;

      return {
        rowIndex: nodeInfo.rowIndex,
        columnIndex: nodeInfo.columnIndex,
        columnId: `col_${nodeInfo.columnIndex}`,
        isHeader: nodeInfo.isHeader,
        cellId: `${nodeInfo.isHeader ? 'header' : 'row'}_${nodeInfo.rowIndex}_col_${nodeInfo.columnIndex}`,
      };
    },
    [slateNodeMap],
  );

  const getRowPosition: TableContextType['getRowPosition'] = useCallback(
    (targetNode) => {
      for (const [node, info] of slateNodeMap.entries()) {
        if (node === targetNode) {
          return {
            rowIndex: info.rowIndex,
            isHeader: info.isHeader,
            rowId: `${info.isHeader ? 'header' : 'row'}_${info.rowIndex}`,
          };
        }
      }

      return null;
    },
    [slateNodeMap],
  );

  const updateCellData: TableContextType['updateCellData'] = useCallback((rowIndex, columnId, value) => {
    // This would need to update the Slate editor
    console.log('Update cell data:', { rowIndex, columnId, value });
  }, []);

  const getCellData: TableContextType['getCellData'] = useCallback(
    (rowIndex, columnId) => {
      const row = tableData.find((r) => r._rowIndex === rowIndex);

      return row ? row[columnId] : null;
    },
    [tableData],
  );

  const getRowById: TableContextType['getRowById'] = useCallback(
    (rowId) => {
      return table.getRowModel().rows.find((row) => row.id === rowId);
    },
    [table],
  );

  const getCellById: TableContextType['getCellById'] = useCallback(
    (rowId, columnId) => {
      const row = getRowById(rowId);

      return row ? row.getVisibleCells().find((cell) => cell.column.id === columnId) : undefined;
    },
    [getRowById],
  );

  // Calculate if maximum limits are reached
  const isReachMaximumColumns: TableContextType['isReachMaximumColumns'] = useMemo(() => {
    return columnCount >= TABLE_MAX_COLUMNS;
  }, [columnCount]);

  const isReachMaximumRows: TableContextType['isReachMaximumRows'] = useMemo(() => {
    return rowCount >= TABLE_MAX_ROWS;
  }, [rowCount]);

  const contextValue: TableContextType = useMemo(
    () => ({
      table,
      tableElement: element,
      columnCount,
      rowCount,
      columns,
      data: tableData,
      getCellPosition,
      getRowPosition,
      updateCellData,
      getCellData,
      getRowById,
      getCellById,
      addColumn,
      addRow,
      addColumnAndRow,
      isReachMaximumColumns,
      isReachMaximumRows,
      tableSelectedOn,
      setTableSelectedOn,
    }),
    [
      table,
      element,
      columnCount,
      rowCount,
      columns,
      tableData,
      getCellPosition,
      getRowPosition,
      updateCellData,
      getCellData,
      getRowById,
      getCellById,
      addColumn,
      addRow,
      addColumnAndRow,
      isReachMaximumColumns,
      isReachMaximumRows,
      tableSelectedOn,
      setTableSelectedOn,
    ],
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div {...attributes} className="qdr-table">
        {children}
        <button
          type="button"
          onClick={() => setTableSelectedOn((prev) => (prev === 'table' ? undefined : 'table'))}
          className="qdr-table__selection"
          title={tableSelectedOn === 'table' ? 'Deselect Table' : 'Select Table'}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      </div>
    </TableContext.Provider>
  );
}

export default Table;
