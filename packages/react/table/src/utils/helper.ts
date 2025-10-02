import { Element, PARAGRAPH_TYPE, Transforms, QuadratsElement } from '@quadrats/core';
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
import { ALIGN_TYPE, ALIGNABLE_TYPES, AlignValue } from '@quadrats/common/align';
import { ParagraphElement } from '@quadrats/common/paragraph';
import { HeadingElement } from '@quadrats/common/heading';

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
  if (Element.isElement(tableStructure.tableBodyElement)) {
    const lastRow = tableStructure.tableBodyElement.children[tableStructure.tableBodyElement.children.length - 1];

    if (Element.isElement(lastRow) && lastRow.type.includes(TABLE_ROW_TYPE)) {
      if (
        lastRow.children[0] &&
        Element.isElement(lastRow.children[0]) &&
        lastRow.children[0].type.includes(TABLE_CELL_TYPE)
      ) {
        // 如果最後一行 body row 的第一個 cell 是 pinned，代表有任何 pinned columns
        return lastRow.children[0].pinned === true;
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

  if (tableStructure.tableHeaderElement.children[0]) {
    const firstRow = tableStructure.tableHeaderElement.children[0];

    if (Element.isElement(firstRow) && firstRow.type.includes(TABLE_ROW_TYPE)) {
      // 如果第一個 header row 的所有 cell 都是 pinned，代表有任何 pinned rows
      return firstRow.children.every(
        (cell) => Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && (cell as TableElement).pinned,
      );
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

    if (referenceCell.children[0]?.align) {
      baseCell.children[0].align = referenceCell.children[0].align;
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

/**
 * 收集指定範圍的 cells
 * @param tableStructure - 表格結構
 * @param scope - 'table' | 'column'
 * @param columnIndex - 當 scope 為 'column' 時需要指定
 * @returns cells 陣列
 */
export function collectCells(
  tableStructure: TableStructure,
  scope: 'table' | 'column',
  columnIndex?: number,
): Element[] {
  const containers = [tableStructure.tableBodyElement, tableStructure.tableHeaderElement].filter(
    Boolean,
  ) as TableElement[];

  const cells: Element[] = [];

  for (const container of containers) {
    if (!Element.isElement(container)) continue;

    for (const row of container.children) {
      if (!Element.isElement(row)) continue;

      if (scope === 'column' && typeof columnIndex === 'number') {
        // 收集指定 column 的 cells
        const cell = row.children[columnIndex];

        if (Element.isElement(cell)) {
          cells.push(cell);
        }
      } else if (scope === 'table') {
        // 收集所有 cells
        for (const cell of row.children) {
          if (Element.isElement(cell)) {
            cells.push(cell);
          }
        }
      }
    }
  }

  return cells;
}

/**
 * 設定指定 cells 的 align
 * @param editor - Slate editor
 * @param cells - 要設定 align 的 cell 元素陣列
 * @param alignValue - align 值
 */
export function setAlignForCells(editor: QuadratsReactEditor, cells: Element[], alignValue: AlignValue) {
  for (const cell of cells) {
    if (!Element.isElement(cell)) continue;

    const cellPath = ReactEditor.findPath(editor, cell as TableElement);

    // 對 cell 內的所有可 align 的元素設定 align
    for (let contentIndex = 0; contentIndex < cell.children.length; contentIndex++) {
      const content = cell.children[contentIndex];

      if (
        Element.isElement(content) &&
        (content as QuadratsElement).type &&
        ALIGNABLE_TYPES.includes((content as QuadratsElement).type)
      ) {
        const contentPath = [...cellPath, contentIndex];

        Transforms.setNodes(editor, { [ALIGN_TYPE]: alignValue } as Partial<ParagraphElement | HeadingElement>, {
          at: contentPath,
        });
      }
    }
  }
}

/**
 * 獲取指定 cells 的 align 狀態
 * @param cells - 要檢查的 cell 元素陣列
 * @returns 如果所有 cell 的 align 都相同則返回該值，否則返回 'left'
 */
export function getAlignFromCells(cells: Element[]): AlignValue {
  const alignValues: AlignValue[] = [];

  for (const cell of cells) {
    if (!Element.isElement(cell)) continue;

    // 檢查 cell 內的第一個可 align 元素
    for (const content of cell.children) {
      if (
        Element.isElement(content) &&
        (content as QuadratsElement).type &&
        ALIGNABLE_TYPES.includes((content as QuadratsElement).type)
      ) {
        const alignValue = (content as ParagraphElement | HeadingElement)[ALIGN_TYPE];

        if (alignValue) {
          alignValues.push(alignValue as AlignValue);
        }

        break; // 只檢查第一個可 align 元素
      }
    }
  }

  // 如果所有 align 值都相同，返回該值；否則返回預設的 'left'
  if (alignValues.length > 0) {
    const firstAlign = alignValues[0];
    const allSame = alignValues.every((align) => align === firstAlign);

    if (allSame) {
      return firstAlign;
    }
  }

  return 'left';
}
