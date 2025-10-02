import { Element, PARAGRAPH_TYPE, Transforms, QuadratsElement } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import {
  TABLE_MAIN_TYPE,
  TABLE_BODY_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_ROW_TYPE,
  TABLE_CELL_TYPE,
  TableElement,
  ColumnWidth,
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

/**
 * 獲取表格的欄位寬度陣列
 * @param tableElement - 表格最外層元素
 * @returns 欄位寬度陣列，如果沒有設定則返回平均分配的 percentage
 */
export function getColumnWidths(tableElement: TableElement): ColumnWidth[] {
  const tableStructure = getTableElements(tableElement);
  const { tableBodyElement } = tableStructure;

  if (!tableBodyElement || !Element.isElement(tableBodyElement)) {
    return [];
  }

  const firstRow = tableBodyElement.children[0];

  if (!Element.isElement(firstRow)) {
    return [];
  }

  const columnCount = firstRow.children.length;

  // 如果 tableElement 有 columnWidths，使用它
  if (tableElement.columnWidths && tableElement.columnWidths.length === columnCount) {
    return [...tableElement.columnWidths];
  }

  // 否則返回平均分配的 percentage（精確到小數點後一位）
  const equalPercentage = Math.round((100 / columnCount) * 10) / 10;

  return Array(columnCount)
    .fill(null)
    .map(() => ({ type: 'percentage' as const, value: equalPercentage }));
}

/**
 * 設定表格的欄位寬度
 * @param editor - Slate editor
 * @param tableElement - 表格最外層元素
 * @param columnWidths - 欄位寬度陣列
 */
export function setColumnWidths(
  editor: QuadratsReactEditor,
  tableElement: TableElement,
  columnWidths: ColumnWidth[],
): void {
  const tablePath = ReactEditor.findPath(editor, tableElement);

  Transforms.setNodes(editor, { columnWidths: [...columnWidths] } as Partial<TableElement>, { at: tablePath });
}

/**
 * 計算新增欄位後的欄位寬度
 * 此函數會智慧處理欄位寬度的重新分配：
 * - 如果所有欄位都是 percentage：按比例縮減現有欄位，新欄位佔平均寬度
 * - 如果有 pixel 欄位：保持 pixel 欄位不變，只調整 percentage 欄位
 *
 * 範例：[20%, 20%, 40%, 20%] 新增一欄 → [16%, 16%, 32%, 16%, 20%]
 *
 * @param currentWidths - 當前的欄位寬度陣列
 * @param insertIndex - 新欄位插入的位置（0-based）
 * @returns 新的欄位寬度陣列
 */
export function calculateColumnWidthsAfterAdd(currentWidths: ColumnWidth[], insertIndex: number): ColumnWidth[] {
  const newColumnCount = currentWidths.length + 1;
  const averagePercentage = Math.round((100 / newColumnCount) * 10) / 10;

  // 分離 percentage 和 pixel 欄位
  const percentageColumns: { index: number; value: number }[] = [];

  currentWidths.forEach((width, index) => {
    if (width.type === 'percentage') {
      percentageColumns.push({ index, value: width.value });
    }
  });

  // 如果所有欄位都是 percentage
  if (percentageColumns.length === currentWidths.length) {
    const currentTotal = percentageColumns.reduce((sum, col) => sum + col.value, 0);
    const targetTotal = 100 - averagePercentage;
    const scaleFactor = targetTotal / currentTotal;

    const newWidths: ColumnWidth[] = [];

    currentWidths.forEach((width, index) => {
      if (index === insertIndex) {
        // 插入新欄位
        newWidths.push({ type: 'percentage', value: averagePercentage });
      }

      // 按比例縮減現有欄位
      const scaledValue = Math.round((width as { value: number }).value * scaleFactor * 10) / 10;

      newWidths.push({ type: 'percentage', value: scaledValue });
    });

    // 如果插入位置在最後
    if (insertIndex >= currentWidths.length) {
      newWidths.push({ type: 'percentage', value: averagePercentage });
    }

    return newWidths;
  }

  // 如果有混合的 pixel 和 percentage 欄位
  // 保持 pixel 欄位不變，只調整 percentage 欄位
  const newWidths: ColumnWidth[] = [];
  const remainingPercentage = 100; // 這裡簡化處理，實際應該根據 pixel 佔比計算

  currentWidths.forEach((width, index) => {
    if (index === insertIndex) {
      // 插入新欄位（使用平均百分比）
      newWidths.push({ type: 'percentage', value: averagePercentage });
    }

    if (width.type === 'pixel') {
      // pixel 欄位保持不變
      newWidths.push({ ...width });
    } else {
      // percentage 欄位按比例縮減
      const currentPercentageTotal = percentageColumns.reduce((sum, col) => sum + col.value, 0);
      const targetPercentageTotal = remainingPercentage - averagePercentage;
      const scaleFactor = targetPercentageTotal / currentPercentageTotal;
      const scaledValue = Math.round(width.value * scaleFactor * 10) / 10;

      newWidths.push({ type: 'percentage', value: scaledValue });
    }
  });

  // 如果插入位置在最後
  if (insertIndex >= currentWidths.length) {
    newWidths.push({ type: 'percentage', value: averagePercentage });
  }

  return newWidths;
}

/**
 * 計算刪除欄位後的欄位寬度
 * 此函數會智慧處理欄位寬度的重新分配：
 * - 如果所有欄位都是 percentage：按比例放大剩餘欄位
 * - 如果有 pixel 欄位：保持 pixel 欄位不變，只調整 percentage 欄位
 *
 * @param currentWidths - 當前的欄位寬度陣列
 * @param deleteIndex - 要刪除的欄位索引（0-based）
 * @returns 新的欄位寬度陣列
 */
export function calculateColumnWidthsAfterDelete(currentWidths: ColumnWidth[], deleteIndex: number): ColumnWidth[] {
  if (currentWidths.length <= 1) {
    return currentWidths;
  }

  const deletedWidth = currentWidths[deleteIndex];
  const newWidths = currentWidths.filter((_, index) => index !== deleteIndex);

  // 如果刪除的是 pixel 欄位，其他欄位保持不變
  if (deletedWidth.type === 'pixel') {
    return newWidths;
  }

  // 刪除的是 percentage 欄位
  const deletedPercentage = deletedWidth.value;

  // 分離 percentage 和 pixel 欄位
  const percentageIndices: number[] = [];

  newWidths.forEach((width, index) => {
    if (width.type === 'percentage') {
      percentageIndices.push(index);
    }
  });

  // 如果沒有 percentage 欄位，直接返回
  if (percentageIndices.length === 0) {
    return newWidths;
  }

  // 將刪除欄位的百分比按比例分配給其他 percentage 欄位
  const currentPercentageTotal = percentageIndices.reduce((sum, index) => sum + newWidths[index].value, 0);

  return newWidths.map((width) => {
    if (width.type === 'percentage') {
      const proportion = width.value / currentPercentageTotal;
      const additionalPercentage = deletedPercentage * proportion;
      const newValue = Math.round((width.value + additionalPercentage) * 10) / 10;

      return { type: 'percentage', value: newValue };
    }

    return width;
  });
}

/**
 * 計算拖曳後的欄位寬度
 * 此函數會智慧處理混合的固定欄位和彈性欄位：
 * - 如果當前欄位或下一欄位是固定寬度（pixel），則不進行調整
 * - 只有兩個都是彈性欄位（percentage）時才進行寬度調整
 *
 * @param currentWidths - 當前的欄位寬度陣列
 * @param columnIndex - 被調整的欄位索引
 * @param deltaPercentage - 寬度變化量（百分比）
 * @returns 新的欄位寬度陣列
 */
export function calculateResizedColumnWidths(
  currentWidths: ColumnWidth[],
  columnIndex: number,
  deltaPercentage: number,
): ColumnWidth[] {
  const newWidths = [...currentWidths];
  const nextColumnIndex = columnIndex + 1;

  // 確保索引有效
  if (nextColumnIndex >= newWidths.length) {
    return newWidths;
  }

  const currentCol = newWidths[columnIndex];
  const nextCol = newWidths[nextColumnIndex];

  // 如果任一欄位是固定寬度，則不進行調整
  // 未來可以擴展為：調整彈性欄位的寬度來適應固定欄位
  if (currentCol.type === 'pixel' || nextCol.type === 'pixel') {
    return newWidths;
  }

  // 兩個都是 percentage，進行調整
  const currentWidth = currentCol.value;
  const nextWidth = nextCol.value;

  // 計算新寬度（保留小數點後一位）
  let newCurrentWidth = Math.round((currentWidth + deltaPercentage) * 10) / 10;
  let newNextWidth = Math.round((nextWidth - deltaPercentage) * 10) / 10;

  // 確保寬度不小於最小值（5%）
  const minWidth = 5;

  if (newCurrentWidth < minWidth) {
    newCurrentWidth = minWidth;
    newNextWidth = Math.round((currentWidth + nextWidth - minWidth) * 10) / 10;
  } else if (newNextWidth < minWidth) {
    newNextWidth = minWidth;
    newCurrentWidth = Math.round((currentWidth + nextWidth - minWidth) * 10) / 10;
  }

  newWidths[columnIndex] = { type: 'percentage', value: newCurrentWidth };
  newWidths[nextColumnIndex] = { type: 'percentage', value: newNextWidth };

  return newWidths;
}

/**
 * 將 ColumnWidth 轉換為 CSS 可用的字串
 * @param width - 欄位寬度定義
 * @returns CSS 寬度字串（例如 "30%" 或 "200px"）
 */
export function columnWidthToCSS(width: ColumnWidth): string {
  if (width.type === 'percentage') {
    // 保留小數點後一位
    return `${width.value.toFixed(1)}%`;
  }

  return `${width.value}px`;
}

/**
 * 計算欄位寬度的顯示值（用於 size indicator）
 * @param width - 欄位寬度定義
 * @returns 顯示字串（例如 "30%" 或 "200px"）
 */
export function getColumnWidthDisplay(width: ColumnWidth): string {
  if (width.type === 'percentage') {
    // 顯示小數點後一位
    return `${width.value.toFixed(1)}%`;
  }

  return `${width.value}px`;
}
