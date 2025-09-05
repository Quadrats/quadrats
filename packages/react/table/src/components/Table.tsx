import React, { useMemo, useCallback } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { RenderElementProps } from '@quadrats/react';
import { Element, Node } from '@quadrats/core';
import { TableContext } from '../contexts/TableContext';
import { RenderTableElementProps, TableRowData, CellPosition, RowPosition } from '../typings';

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
  // Extract and process table data from Slate element structure
  const { tableData, columnCount, rowCount, slateNodeMap } = useMemo(() => {
    const childElements = element.children.filter((child) => Element.isElement(child));

    // Find table_main element which contains the actual table structure
    const tableMainElement = childElements.find((child) => (child as any).type?.includes('table_main'));

    if (!tableMainElement) {
      return { tableData: [], columnCount: 0, rowCount: 0, slateNodeMap: new Map() };
    }

    const tableMainChildren = (tableMainElement as any).children.filter((child: any) => Element.isElement(child));

    // Find header and rows within table_main
    const headerElement = tableMainChildren.find((child: any) => child.type?.includes('table_header'));
    const rowElements = tableMainChildren.filter((child: any) => child.type?.includes('table_row'));

    const cols = headerElement ? (headerElement as any).children.length : 0;
    const rows = rowElements.length + (headerElement ? 1 : 0);

    // Create mapping between Slate nodes and table positions
    const nodeMap = new Map<Node, { rowIndex: number; columnIndex: number; isHeader: boolean }>();

    // Create table data structure that syncs with Slate
    const data: TableRowData[] = [];

    // Add header row if exists
    if (headerElement) {
      const headerRow: TableRowData = {
        _rowIndex: 0,
        _isHeader: true,
        _slateNode: headerElement,
        _rowId: 'header_0',
      };

      (headerElement as any).children.forEach((cell: any, index: number) => {
        const columnId = `col_${index}`;

        headerRow[columnId] = cell;

        // Map cell node to its position
        nodeMap.set(cell, {
          rowIndex: 0,
          columnIndex: index,
          isHeader: true,
        });
      });

      data.push(headerRow);
    }

    // Add body rows
    rowElements.forEach((rowElement: any, rowIndex: number) => {
      const actualRowIndex = rowIndex + (headerElement ? 1 : 0);
      const row: TableRowData = {
        _rowIndex: actualRowIndex,
        _isHeader: false,
        _slateNode: rowElement,
        _rowId: `row_${actualRowIndex}`,
      };

      (rowElement as any).children.forEach((cell: any, cellIndex: number) => {
        const columnId = `col_${cellIndex}`;

        row[columnId] = cell;

        // Map cell node to its position
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

  // Create columns for TanStack Table
  const columns = useMemo(() => {
    return Array.from({ length: columnCount }, (_, index) =>
      columnHelper.accessor(`col_${index}`, {
        id: `col_${index}`,
        header: `Column ${index + 1}`,
        cell: (info) => info.getValue(),
      }),
    );
  }, [columnCount]);

  // Create TanStack Table instance
  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => row._rowId,
  });

  // Helper functions for context
  const getCellPosition = useCallback(
    (targetNode: Node): CellPosition | null => {
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

  const getRowPosition = useCallback(
    (targetNode: Node): RowPosition | null => {
      // Try to find if the node is a row itself
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

  const updateCellData = useCallback((rowIndex: number, columnId: string, value: any) => {
    // This would need to update the Slate editor
    // For now, we'll just log the intention
    console.log('Update cell data:', { rowIndex, columnId, value });
  }, []);

  const getCellData = useCallback(
    (rowIndex: number, columnId: string) => {
      const row = tableData.find((r) => r._rowIndex === rowIndex);

      return row ? row[columnId] : null;
    },
    [tableData],
  );

  const getRowById = useCallback(
    (rowId: string) => {
      return table.getRowModel().rows.find((row) => row.id === rowId);
    },
    [table],
  );

  const getCellById = useCallback(
    (rowId: string, columnId: string) => {
      const row = getRowById(rowId);

      return row ? row.getVisibleCells().find((cell) => cell.column.id === columnId) : undefined;
    },
    [getRowById],
  );

  const contextValue = useMemo(
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
    ],
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div {...attributes} className="qdr-table">
        {children}
      </div>
    </TableContext.Provider>
  );
}

export default Table;
