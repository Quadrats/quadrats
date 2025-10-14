import React, { useMemo, useRef, useCallback } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { Element } from '@quadrats/core';
import { TableActionsContext } from '../contexts/TableActionsContext';
import { TableMetadataContext } from '../contexts/TableMetadataContext';
import { TableStateContext } from '../contexts/TableStateContext';
import { RenderTableElementProps, TableContextType } from '../typings';
import {
  TABLE_DEFAULT_MAX_COLUMNS,
  TABLE_DEFAULT_MAX_ROWS,
  TABLE_ROW_TYPE,
  TABLE_CELL_TYPE,
  TableElement,
} from '@quadrats/common/table';
import { useTableActions } from '../hooks/useTableActions';
import { Icon } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { useTableStates } from '../hooks/useTableStates';
import { getTableElements } from '../utils/helper';

function Table({
  attributes,
  children,
  element,
}: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderTableElementProps['element'];
}) {
  const {
    addColumn,
    addRow,
    addColumnAndRow,
    deleteRow,
    deleteColumn,
    moveRowToBody,
    moveRowToHeader,
    unsetColumnAsTitle,
    setColumnAsTitle,
    pinColumn,
    pinRow,
    unpinColumn,
    unpinRow,
    swapRow,
    swapColumn,
    swapCell,
  } = useTableActions(element);

  const { tableSelectedOn, setTableSelectedOn, tableHoveredOn, setTableHoveredOn } = useTableStates();
  const portalContainerRef = useRef<HTMLDivElement>(null);

  const { columnCount, rowCount, normalCols, bodyCount, tableElements } = useMemo(() => {
    const elements = getTableElements(element);

    if (!elements.tableMainElement) {
      return {
        columnCount: 0,
        rowCount: 0,
        treatAsTitleCols: 0,
        normalCols: 0,
        bodyCount: 0,
        headerCount: 0,
        tableElements: elements,
      };
    }

    const headerRowElements = elements.tableHeaderElement
      ? elements.tableHeaderElement.children.filter(
          (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
        )
      : [];

    const bodyRowElements = elements.tableBodyElement
      ? elements.tableBodyElement.children.filter(
          (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
        )
      : [];

    const cols =
      bodyRowElements.length > 0 && Element.isElement(bodyRowElements[0]) ? bodyRowElements[0].children.length : 0;

    const treatAsTitleCols =
      bodyRowElements.length > 0 && Element.isElement(bodyRowElements[0])
        ? bodyRowElements[0].children.filter((row) => (Element.isElement(row) ? row.treatAsTitle : false)).length
        : 0;

    const rows = headerRowElements.length + bodyRowElements.length;

    return {
      columnCount: cols,
      rowCount: rows,
      headerCount: headerRowElements.length,
      bodyCount: bodyRowElements.length,
      treatAsTitleCols,
      normalCols: cols - treatAsTitleCols,
      tableElements: elements,
    };
  }, [element]);

  // 預計算所有 cell positions
  const cellPositions = useMemo(() => {
    const positions = new Map<TableElement, { columnIndex: number; rowIndex: number }>();

    if (!tableElements.tableMainElement) return positions;

    const { tableHeaderElement, tableBodyElement } = tableElements;
    let globalRowIndex = 0;

    // Process header rows
    if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
      for (const row of tableHeaderElement.children) {
        if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
          for (let colIndex = 0; colIndex < row.children.length; colIndex++) {
            const cell = row.children[colIndex];

            if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
              positions.set(cell as TableElement, {
                columnIndex: colIndex,
                rowIndex: globalRowIndex,
              });
            }
          }

          globalRowIndex++;
        }
      }
    }

    // Process body rows
    if (tableBodyElement && Element.isElement(tableBodyElement)) {
      for (const row of tableBodyElement.children) {
        if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
          for (let colIndex = 0; colIndex < row.children.length; colIndex++) {
            const cell = row.children[colIndex];

            if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
              positions.set(cell as TableElement, {
                columnIndex: colIndex,
                rowIndex: globalRowIndex,
              });
            }
          }

          globalRowIndex++;
        }
      }
    }

    return positions;
  }, [tableElements]);

  // 預計算 pinned columns 和 rows
  const { pinnedColumns, pinnedRows } = useMemo(() => {
    const columns = new Set<number>();
    const rows = new Set<number>();

    if (!tableElements.tableBodyElement) return { pinnedColumns: columns, pinnedRows: rows };

    const { tableHeaderElement, tableBodyElement } = tableElements;

    // 檢查 pinned columns - 只需要檢查第一個 body row
    if (Element.isElement(tableBodyElement) && tableBodyElement.children.length > 0) {
      const firstBodyRow = tableBodyElement.children[0];

      if (Element.isElement(firstBodyRow) && firstBodyRow.type.includes(TABLE_ROW_TYPE)) {
        for (let colIndex = 0; colIndex < firstBodyRow.children.length; colIndex++) {
          const cell = firstBodyRow.children[colIndex];

          if (
            Element.isElement(cell) &&
            cell.type.includes(TABLE_CELL_TYPE) &&
            (cell as TableElement).treatAsTitle &&
            (cell as TableElement).pinned
          ) {
            columns.add(colIndex);
          }
        }
      }
    }

    // 檢查 pinned rows - 只需要檢查 header rows
    if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
      for (let rowIndex = 0; rowIndex < tableHeaderElement.children.length; rowIndex++) {
        const row = tableHeaderElement.children[rowIndex];

        if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
          // 檢查這一行的所有 cells 是否都是 pinned
          const allCellsPinned = row.children.every(
            (cell) => Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && (cell as TableElement).pinned,
          );

          if (allCellsPinned) {
            rows.add(rowIndex);
          }
        }
      }
    }

    return { pinnedColumns: columns, pinnedRows: rows };
  }, [tableElements]);

  const isReachMaximumColumns: TableContextType['isReachMaximumColumns'] = useMemo(() => {
    return columnCount >= TABLE_DEFAULT_MAX_COLUMNS;
  }, [columnCount]);

  const isReachMaximumRows: TableContextType['isReachMaximumRows'] = useMemo(() => {
    return TABLE_DEFAULT_MAX_ROWS > 0 ? rowCount >= TABLE_DEFAULT_MAX_ROWS : false;
  }, [rowCount]);

  const isReachMinimumNormalColumns: TableContextType['isReachMinimumNormalColumns'] = useMemo(() => {
    return normalCols <= 1;
  }, [normalCols]);

  const isReachMinimumBodyRows: TableContextType['isReachMinimumBodyRows'] = useMemo(() => {
    return bodyCount <= 1;
  }, [bodyCount]);

  const isColumnPinned = useCallback(
    (columnIndex: number): boolean => {
      return pinnedColumns.has(columnIndex);
    },
    [pinnedColumns],
  );

  const isRowPinned = useCallback(
    (rowIndex: number): boolean => {
      return pinnedRows.has(rowIndex);
    },
    [pinnedRows],
  );

  const actionsValue = useMemo(
    () => ({
      addColumn,
      addRow,
      addColumnAndRow,
      deleteRow,
      deleteColumn,
      moveRowToBody,
      moveRowToHeader,
      unsetColumnAsTitle,
      setColumnAsTitle,
      pinColumn,
      pinRow,
      unpinColumn,
      unpinRow,
      swapRow,
      swapColumn,
      swapCell,
    }),
    [
      addColumn,
      addRow,
      addColumnAndRow,
      deleteRow,
      deleteColumn,
      moveRowToBody,
      moveRowToHeader,
      unsetColumnAsTitle,
      setColumnAsTitle,
      pinColumn,
      pinRow,
      unpinColumn,
      unpinRow,
      swapRow,
      swapColumn,
      swapCell,
    ],
  );

  const metadataValue = useMemo(
    () => ({
      tableElement: element,
      columnCount,
      rowCount,
      portalContainerRef,
      isReachMaximumColumns,
      isReachMaximumRows,
      isReachMinimumNormalColumns,
      isReachMinimumBodyRows,
      pinnedColumns,
      pinnedRows,
      cellPositions,
      isColumnPinned,
      isRowPinned,
    }),
    [
      element,
      columnCount,
      rowCount,
      portalContainerRef,
      isReachMaximumColumns,
      isReachMaximumRows,
      isReachMinimumNormalColumns,
      isReachMinimumBodyRows,
      pinnedColumns,
      pinnedRows,
      cellPositions,
      isColumnPinned,
      isRowPinned,
    ],
  );

  const stateValue = useMemo(
    () => ({
      tableSelectedOn,
      setTableSelectedOn,
      tableHoveredOn,
      setTableHoveredOn,
    }),
    [tableSelectedOn, setTableSelectedOn, tableHoveredOn, setTableHoveredOn],
  );

  return (
    <TableActionsContext.Provider value={actionsValue}>
      <TableMetadataContext.Provider value={metadataValue}>
        <TableStateContext.Provider value={stateValue}>
          <div {...attributes} className="qdr-table">
            {children}
            <button
              type="button"
              onClick={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();

                setTableSelectedOn((prev) => (prev?.region === 'table' ? undefined : { region: 'table' }));
              }}
              onMouseDown={(evt) => {
                evt.preventDefault();
                evt.stopPropagation();
              }}
              className="qdr-table__selection"
              title={tableSelectedOn?.region === 'table' ? 'Deselect Table' : 'Select Table'}
            >
              <Icon icon={Drag} width={20} height={20} />
            </button>
            {/* Portal container for table cell toolbars */}
            <div
              ref={portalContainerRef}
              className="qdr-table__portal-container"
              data-slate-editor={false}
              contentEditable={false}
            />
          </div>
        </TableStateContext.Provider>
      </TableMetadataContext.Provider>
    </TableActionsContext.Provider>
  );
}

export default Table;
