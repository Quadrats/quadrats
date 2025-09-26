import { Element, PARAGRAPH_TYPE } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import {
  TABLE_MAIN_TYPE,
  TABLE_BODY_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_ROW_TYPE,
  TABLE_CELL_TYPE,
  TableElement,
} from '@quadrats/common/table';
import { QuadratsReactEditor } from '@quadrats/react';

export interface TableElements {
  tableMainElement: TableElement | null;
  tableBodyElement: TableElement | null;
  tableHeaderElement: TableElement | null;
}

export interface TablePaths {
  tableMainPath: number[];
  tableBodyPath: number[];
  tableHeaderPath: number[] | null;
}

export interface TableStructure extends TableElements, TablePaths {
  headerRowCount: number;
  columnCount: number;
  firstRow: Element | null;
}

/**
 * 提取表格的所有基本元素
 */
export function getTableElements(element: TableElement): TableElements {
  const tableMainElement = element.children.find(
    (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
  ) as TableElement | null;

  if (!tableMainElement || !Element.isElement(tableMainElement)) {
    return {
      tableMainElement: null,
      tableBodyElement: null,
      tableHeaderElement: null,
    };
  }

  const tableBodyElement = tableMainElement.children.find(
    (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
  ) as TableElement | null;

  const tableHeaderElement = tableMainElement.children.find(
    (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
  ) as TableElement | null;

  return {
    tableMainElement: Element.isElement(tableMainElement) ? tableMainElement : null,
    tableBodyElement: Element.isElement(tableBodyElement) ? tableBodyElement : null,
    tableHeaderElement: Element.isElement(tableHeaderElement) ? tableHeaderElement : null,
  };
}

/**
 * 獲取表格的完整結構
 */
export function getTableStructure(editor: QuadratsReactEditor, element: TableElement): TableStructure | null {
  const elements = getTableElements(element);

  if (!elements.tableMainElement || !elements.tableBodyElement) {
    return null;
  }

  const tableMainPath = ReactEditor.findPath(editor, elements.tableMainElement);
  const tableBodyPath = ReactEditor.findPath(editor, elements.tableBodyElement);
  const tableHeaderPath = elements.tableHeaderElement
    ? ReactEditor.findPath(editor, elements.tableHeaderElement)
    : null;

  const headerRowCount = elements.tableHeaderElement?.children.length || 0;
  const firstRow = elements.tableBodyElement.children[0];
  const columnCount = Element.isElement(firstRow) ? firstRow.children.length : 0;

  return {
    ...elements,
    tableMainPath,
    tableBodyPath,
    tableHeaderPath,
    headerRowCount,
    columnCount,
    firstRow: Element.isElement(firstRow) ? firstRow : null,
  };
}

/**
 * 檢查列是否有 pinned cells
 */
export function hasColumnPinnedCells(tableStructure: TableStructure, columnIndex: number): boolean {
  const containers = [tableStructure.tableBodyElement, tableStructure.tableHeaderElement].filter(Boolean);

  for (const container of containers) {
    if (!Element.isElement(container)) continue;

    for (const row of container.children) {
      if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
        const cell = row.children[columnIndex];

        if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && (cell as TableElement).pinned) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 檢查是否有任何 pinned columns
 */
export function hasAnyPinnedColumns(tableStructure: TableStructure): boolean {
  const containers = [tableStructure.tableHeaderElement, tableStructure.tableBodyElement].filter(Boolean);

  for (const container of containers) {
    if (!Element.isElement(container)) continue;

    for (const row of container.children) {
      if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
        for (const cell of row.children) {
          if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && cell.pinned) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * 檢查是否有任何 pinned rows
 */
export function hasAnyPinnedRows(tableStructure: TableStructure): boolean {
  if (!tableStructure.tableHeaderElement) return false;

  for (const row of tableStructure.tableHeaderElement.children) {
    if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
      for (const cell of row.children) {
        if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && cell.pinned) {
          return true;
        }
      }
    }
  }

  return false;
}

/**
 * 創建新的 table cell
 */
export function createTableCell(referenceCell?: TableElement, overrideProps?: Partial<TableElement>): TableElement {
  const baseCell: TableElement = {
    type: TABLE_CELL_TYPE,
    children: [
      {
        type: PARAGRAPH_TYPE,
        children: [{ text: '' }],
      },
    ],
  };

  if (referenceCell) {
    if (referenceCell.treatAsTitle) {
      baseCell.treatAsTitle = true;
    }

    if (referenceCell.pinned) {
      baseCell.pinned = true;
    }
  }

  return { ...baseCell, ...overrideProps };
}

/**
 * 獲取參考 row
 */
export function getReferenceRowFromHeaderOrBody(
  HeaderOrBodyContainer: TableElement,
  rowIndex: number,
): TableElement | undefined {
  const row = HeaderOrBodyContainer.children[rowIndex];

  if (!Element.isElement(row) || !row.type.includes(TABLE_ROW_TYPE)) {
    return undefined;
  }

  return row as TableElement;
}
