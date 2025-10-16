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
  MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE,
  MIN_COLUMN_WIDTH_PIXEL,
  MIN_COLUMN_WIDTH_PERCENTAGE,
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
 * 獲取釘選欄位的資訊
 * @param tableElement - 表格最外層元素
 * @returns 釘選欄位的索引陣列和總寬度百分比
 */
export function getPinnedColumnsInfo(tableElement: TableElement): {
  pinnedColumnIndices: number[];
  totalPinnedPercentage: number;
} {
  const { tableBodyElement } = getTableElements(tableElement);

  if (!tableBodyElement || !Element.isElement(tableBodyElement)) {
    return { pinnedColumnIndices: [], totalPinnedPercentage: 0 };
  }

  const firstRow = tableBodyElement.children[0];

  if (!Element.isElement(firstRow)) {
    return { pinnedColumnIndices: [], totalPinnedPercentage: 0 };
  }

  const pinnedColumnIndices: number[] = [];
  let totalPinnedPercentage = 0;

  firstRow.children.forEach((cell, index) => {
    if (Element.isElement(cell) && cell.treatAsTitle && cell.pinned) {
      pinnedColumnIndices.push(index);

      // 如果有設定 columnWidths，使用設定的寬度
      if (tableElement.columnWidths && tableElement.columnWidths[index]) {
        const width = tableElement.columnWidths[index];

        if (width.type === 'percentage') {
          totalPinnedPercentage += width.value;
        }
      }
    }
  });

  return { pinnedColumnIndices, totalPinnedPercentage };
}

/**
 * 強制調整釘選欄位寬度以符合最大限制
 * @param columnWidths - 當前欄位寬度陣列
 * @param pinnedColumnIndices - 釘選欄位索引陣列
 * @returns 調整後的欄位寬度陣列
 */
export function enforcePinnedColumnsMaxWidth(
  columnWidths: ColumnWidth[],
  pinnedColumnIndices: number[],
): ColumnWidth[] {
  if (pinnedColumnIndices.length === 0) {
    return columnWidths;
  }

  // 計算釘選欄位的總寬度
  let totalPinnedPercentage = 0;

  pinnedColumnIndices.forEach((index) => {
    const width = columnWidths[index];

    if (width && width.type === 'percentage') {
      totalPinnedPercentage += width.value;
    }
  });

  // 如果超過最大限制，按比例縮減
  if (totalPinnedPercentage > MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE) {
    const scaleFactor = MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE / totalPinnedPercentage;
    const newWidths = [...columnWidths];

    pinnedColumnIndices.forEach((index) => {
      const width = newWidths[index];

      if (width && width.type === 'percentage') {
        newWidths[index] = {
          type: 'percentage',
          value: Math.round(width.value * scaleFactor * 10) / 10,
        };
      }
    });

    return newWidths;
  }

  return columnWidths;
}

/**
 * 獲取表格的欄位寬度陣列
 * 當有釘選欄位時：
 * - 釘選欄位使用 percentage
 * - 未釘選欄位使用 pixel（基於剩餘空間平均分配）
 * @param tableElement - 表格最外層元素
 * @param tableWidth - 表格容器的實際寬度（pixel），用於計算 pixel 寬度
 * @returns 欄位寬度陣列
 */
export function getColumnWidths(tableElement: TableElement, tableWidth?: number): ColumnWidth[] {
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

  // 獲取釘選欄位資訊
  const { pinnedColumnIndices } = getPinnedColumnsInfo(tableElement);
  const hasPinnedColumns = pinnedColumnIndices.length > 0;

  // 如果 tableElement 有 columnWidths
  if (tableElement.columnWidths && tableElement.columnWidths.length === columnCount) {
    let widths = [...tableElement.columnWidths];

    // 強制檢查釘選欄位是否超過 40%，如果超過則調整
    if (hasPinnedColumns) {
      widths = enforcePinnedColumnsMaxWidth(widths, pinnedColumnIndices);
    }

    return widths;
  }

  // 如果沒有設定 columnWidths，需要初始化
  // 如果有釘選欄位，使用混合模式
  if (hasPinnedColumns && tableWidth) {
    const widths: ColumnWidth[] = [];

    // 先計算釘選欄位的總寬度
    const pinnedPercentagePerColumn = Math.min(
      Math.round((MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE / pinnedColumnIndices.length) * 10) / 10,
      MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE,
    );

    // 計算實際釘選欄位總百分比
    const actualPinnedPercentage = Math.min(
      pinnedPercentagePerColumn * pinnedColumnIndices.length,
      MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE,
    );

    // 計算剩餘空間（pixel）
    const remainingPercentage = 100 - actualPinnedPercentage;
    const remainingPixelWidth = (tableWidth * remainingPercentage) / 100;
    const unpinnedColumnCount = columnCount - pinnedColumnIndices.length;
    const pixelWidthPerColumn = unpinnedColumnCount > 0 ? Math.floor(remainingPixelWidth / unpinnedColumnCount) : 0;

    // 建立寬度陣列
    for (let i = 0; i < columnCount; i++) {
      if (pinnedColumnIndices.includes(i)) {
        widths.push({ type: 'percentage', value: pinnedPercentagePerColumn });
      } else {
        widths.push({ type: 'pixel', value: pixelWidthPerColumn });
      }
    }

    return widths;
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
 * - 如果所有欄位都是 percentage：按比例縮減現有欄位，新欄位佔平均寬度
 * - 如果有混合模式（percentage + pixel）：
 *   * percentage 欄位（pinned）保持不變
 *   * 新欄位使用 pixel（與其他 pixel 欄位平均分配剩餘空間）
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
  const pixelColumns: { index: number; value: number }[] = [];

  currentWidths.forEach((width, index) => {
    if (width.type === 'percentage') {
      percentageColumns.push({ index, value: width.value });
    } else {
      pixelColumns.push({ index, value: width.value });
    }
  });

  // 如果所有欄位都是 percentage（正常模式，無 pinned columns）
  if (percentageColumns.length === currentWidths.length) {
    const currentTotal = percentageColumns.reduce((sum, col) => sum + col.value, 0);
    const targetTotal = 100 - averagePercentage;
    const scaleFactor = targetTotal / currentTotal;

    const newWidths: ColumnWidth[] = [];

    currentWidths.forEach((width, index) => {
      if (index === insertIndex) {
        newWidths.push({ type: 'percentage', value: averagePercentage });
      }

      // 按比例縮減現有欄位
      const scaledValue = Math.round((width as { value: number }).value * scaleFactor * 10) / 10;

      newWidths.push({ type: 'percentage', value: scaledValue });
    });

    if (insertIndex >= currentWidths.length) {
      newWidths.push({ type: 'percentage', value: averagePercentage });
    }

    return newWidths;
  }

  // 如果有混合的 pixel 和 percentage 欄位（有 pinned columns）
  // percentage 欄位（pinned）保持不變
  // 新欄位應維持 pixel（此時一般欄位必定是 pixel）
  if (percentageColumns.length && pixelColumns.length) {
    const newWidths: ColumnWidth[] = [];

    // 找到最後一個 pixel 欄位的寬度，新欄位將複製這個寬度
    const lastPixelWidth = pixelColumns.length > 0 ? pixelColumns[pixelColumns.length - 1].value : 150;

    currentWidths.forEach((width, index) => {
      if (index === insertIndex) {
        newWidths.push({ type: 'pixel', value: lastPixelWidth });
      }

      newWidths.push({ ...width });
    });

    // 如果插入位置在最後
    if (insertIndex >= currentWidths.length) {
      newWidths.push({ type: 'pixel', value: lastPixelWidth });
    }

    return newWidths;
  }

  // Fallback: 返回原始寬度加一個平均 percentage 欄位
  const newWidths = [...currentWidths];

  newWidths.splice(insertIndex, 0, { type: 'percentage', value: averagePercentage });

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
 * 處理釘選欄位的特殊邏輯：
 * - 情況 1：未釘選欄位（pixel）與未釘選欄位（pixel）之間：直接改變 pixel 值，允許超出容器
 * - 情況 2：釘選欄位（percentage）與釘選欄位（percentage）之間：互相調整，且總和不超過 40%
 * - 情況 3：釘選欄位（percentage）與未釘選欄位（pixel）之間：
 *   * 只調整釘選欄位的百分比（不超過 40% 總限制）
 *   * 當 table 未溢出（寬度 < container）時，重新計算所有未釘選欄位的 pixel 值以維持 100%
 *   * 當 table 已溢出時，只調整下一個欄位的 pixel 值
 *   * 當達到 40% 上限時，停止調整
 * - 預設情況：兩個都是 percentage 但都不是釘選欄位（正常模式）
 *
 * @param currentWidths - 當前的欄位寬度陣列
 * @param columnIndex - 被調整的欄位索引
 * @param deltaPercentage - 寬度變化量（百分比）
 * @param deltaPixel - 寬度變化量（pixel）
 * @param pinnedColumnIndices - 釘選欄位的索引陣列
 * @returns 新的欄位寬度陣列
 */
export function calculateResizedColumnWidths(
  currentWidths: ColumnWidth[],
  columnIndex: number,
  deltaPercentage: number,
  deltaPixel: number,
  pinnedColumnIndices: number[] = [],
): ColumnWidth[] {
  const newWidths = [...currentWidths];
  const nextColumnIndex = columnIndex + 1;
  const isLastColumn = nextColumnIndex >= newWidths.length;

  const currentCol = newWidths[columnIndex];
  const nextCol = isLastColumn ? null : newWidths[nextColumnIndex];
  const isCurrentPinned = pinnedColumnIndices.includes(columnIndex);
  const isNextPinned = nextCol ? pinnedColumnIndices.includes(nextColumnIndex) : false;

  // **特殊情況：最後一欄，只調整當前欄位**
  // 最後一欄必定不是 pinned column
  if (isLastColumn) {
    if (currentCol.type === 'pixel') {
      // pixel 欄位（有 pinned column 情境）：直接調整寬度
      const currentPixel = currentCol.value;
      const newCurrentPixel = Math.max(MIN_COLUMN_WIDTH_PIXEL, currentPixel + deltaPixel);

      newWidths[columnIndex] = { type: 'pixel', value: Math.floor(newCurrentPixel) };
    } else if (currentCol.type === 'percentage') {
      // percentage 欄位（無 pinned column 情境）：調整當前欄位並將差額分配給前一欄以確保總和為 100%
      const currentWidth = currentCol.value;
      let newCurrentWidth = Math.max(
        MIN_COLUMN_WIDTH_PERCENTAGE,
        Math.round((currentWidth + deltaPercentage) * 10) / 10,
      );

      // 計算其他欄位的總百分比
      const otherColumnsTotal = newWidths
        .filter((_, idx) => idx !== columnIndex)
        .reduce((sum, width) => sum + (width.type === 'percentage' ? width.value : 0), 0);

      // 確保總和為 100%
      const maxAllowedWidth = 100 - otherColumnsTotal;

      newCurrentWidth = Math.min(newCurrentWidth, maxAllowedWidth);

      // 計算寬度變化量
      const widthChange = currentWidth - newCurrentWidth;

      // 如果有寬度變化且存在前一欄，將差額分配給前一欄
      if (widthChange !== 0 && columnIndex > 0) {
        const prevCol = newWidths[columnIndex - 1];

        if (prevCol.type === 'percentage') {
          const newPrevWidth = Math.max(
            MIN_COLUMN_WIDTH_PERCENTAGE,
            Math.round((prevCol.value + widthChange) * 10) / 10,
          );

          newWidths[columnIndex - 1] = { type: 'percentage', value: newPrevWidth };
        }
      }

      newWidths[columnIndex] = { type: 'percentage', value: newCurrentWidth };
    }

    return newWidths;
  }

  // 以下是有 next column 的邏輯
  if (!nextCol) {
    return newWidths;
  }

  // 情況 1：當前欄位是 pixel（未釘選），下一欄位也是 pixel（未釘選）
  if (currentCol.type === 'pixel' && nextCol.type === 'pixel') {
    const currentPixel = currentCol.value;
    const newCurrentPixel = Math.max(MIN_COLUMN_WIDTH_PIXEL, currentPixel + deltaPixel);

    newWidths[columnIndex] = { type: 'pixel', value: Math.floor(newCurrentPixel) };

    return newWidths;
  }

  // 情況 2：當前欄位是 percentage（釘選），下一欄位也是 percentage（釘選）
  if (currentCol.type === 'percentage' && nextCol.type === 'percentage' && isCurrentPinned && isNextPinned) {
    const currentWidth = currentCol.value;
    const nextWidth = nextCol.value;

    // 計算新寬度
    let newCurrentWidth = Math.round((currentWidth + deltaPercentage) * 10) / 10;
    let newNextWidth = Math.round((nextWidth - deltaPercentage) * 10) / 10;

    if (newCurrentWidth < MIN_COLUMN_WIDTH_PERCENTAGE) {
      newCurrentWidth = MIN_COLUMN_WIDTH_PERCENTAGE;
      newNextWidth = Math.round((currentWidth + nextWidth - MIN_COLUMN_WIDTH_PERCENTAGE) * 10) / 10;
    } else if (newNextWidth < MIN_COLUMN_WIDTH_PERCENTAGE) {
      newNextWidth = MIN_COLUMN_WIDTH_PERCENTAGE;
      newCurrentWidth = Math.round((currentWidth + nextWidth - MIN_COLUMN_WIDTH_PERCENTAGE) * 10) / 10;
    }

    // 確保釘選欄位總和不超過 40%
    const otherPinnedTotal = pinnedColumnIndices
      .filter((idx) => idx !== columnIndex && idx !== nextColumnIndex)
      .reduce((sum, idx) => sum + (newWidths[idx].type === 'percentage' ? newWidths[idx].value : 0), 0);

    const twoColumnsTotal = newCurrentWidth + newNextWidth;

    if (otherPinnedTotal + twoColumnsTotal > MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE) {
      // 按比例縮減這兩個欄位
      const allowedTotal = MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE - otherPinnedTotal;
      const scale = allowedTotal / twoColumnsTotal;

      newCurrentWidth = Math.round(newCurrentWidth * scale * 10) / 10;
      newNextWidth = Math.round(newNextWidth * scale * 10) / 10;
    }

    newWidths[columnIndex] = { type: 'percentage', value: newCurrentWidth };
    newWidths[nextColumnIndex] = { type: 'percentage', value: newNextWidth };

    return newWidths;
  }

  // 情況 3：當前欄位是 percentage（釘選），下一欄位是 pixel（未釘選）
  if (currentCol.type === 'percentage' && nextCol.type === 'pixel' && isCurrentPinned && !isNextPinned) {
    const currentWidth = currentCol.value;

    // 計算新的釘選欄位寬度
    let newCurrentWidth = Math.round((currentWidth + deltaPercentage) * 10) / 10;

    newCurrentWidth = Math.max(MIN_COLUMN_WIDTH_PERCENTAGE, newCurrentWidth);

    // 確保所有釘選欄位總和不超過 40%
    const otherPinnedTotal = pinnedColumnIndices
      .filter((idx) => idx !== columnIndex)
      .reduce((sum, idx) => sum + (newWidths[idx].type === 'percentage' ? newWidths[idx].value : 0), 0);

    const maxAllowedWidth = MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE - otherPinnedTotal;

    // 計算調整前後的實際寬度
    const beforeAdjustWidth = Math.min(currentWidth, maxAllowedWidth);
    const afterAdjustWidth = Math.min(newCurrentWidth, maxAllowedWidth);

    // 如果調整前後的寬度相同（表示已經被限制在上限），則不調整任何欄位
    if (Math.abs(afterAdjustWidth - beforeAdjustWidth) < 0.1) {
      return newWidths;
    }

    // 應用上限限制
    newCurrentWidth = afterAdjustWidth;

    // 更新當前釘選欄位的寬度
    newWidths[columnIndex] = { type: 'percentage', value: newCurrentWidth };

    return newWidths;
  }

  // 預設情況：兩個都是 percentage 但都不是釘選欄位（正常模式）
  if (currentCol.type === 'percentage' && nextCol.type === 'percentage') {
    const currentWidth = currentCol.value;
    const nextWidth = nextCol.value;

    let newCurrentWidth = Math.round((currentWidth + deltaPercentage) * 10) / 10;
    let newNextWidth = Math.round((nextWidth - deltaPercentage) * 10) / 10;

    if (newCurrentWidth < MIN_COLUMN_WIDTH_PERCENTAGE) {
      newCurrentWidth = MIN_COLUMN_WIDTH_PERCENTAGE;
      newNextWidth = Math.round((currentWidth + nextWidth - MIN_COLUMN_WIDTH_PERCENTAGE) * 10) / 10;
    } else if (newNextWidth < MIN_COLUMN_WIDTH_PERCENTAGE) {
      newNextWidth = MIN_COLUMN_WIDTH_PERCENTAGE;
      newCurrentWidth = Math.round((currentWidth + nextWidth - MIN_COLUMN_WIDTH_PERCENTAGE) * 10) / 10;
    }

    newWidths[columnIndex] = { type: 'percentage', value: newCurrentWidth };
    newWidths[nextColumnIndex] = { type: 'percentage', value: newNextWidth };

    return newWidths;
  }

  return newWidths;
}

/**
 * 移動或交換欄位寬度設定
 * @param currentWidths - 當前的欄位寬度陣列
 * @param sourceIndex - 來源欄位的索引
 * @param targetIndex - 目標欄位的索引
 * @param mode - 'swap' 為交換兩個位置，'move' 為移動到目標位置
 * @returns 處理後的欄位寬度陣列
 */
export function moveOrSwapColumnWidth(
  currentWidths: ColumnWidth[],
  sourceIndex: number,
  targetIndex: number,
  mode: 'swap' | 'move' = 'move',
): ColumnWidth[] {
  if (
    sourceIndex === targetIndex ||
    sourceIndex < 0 ||
    targetIndex < 0 ||
    sourceIndex >= currentWidths.length ||
    targetIndex >= currentWidths.length
  ) {
    return currentWidths;
  }

  const newWidths = [...currentWidths];

  if (mode === 'swap') {
    // swap 邏輯：直接交換兩個位置的值
    const temp = newWidths[sourceIndex];

    newWidths[sourceIndex] = newWidths[targetIndex];
    newWidths[targetIndex] = temp;
  } else {
    // move 邏輯：移除再插入
    const [movedWidth] = newWidths.splice(sourceIndex, 1);

    newWidths.splice(targetIndex, 0, movedWidth);
  }

  return newWidths;
}

/**
 * 將 columnWidths 轉換為混合模式（釘選欄位用 percentage，未釘選欄位用 pixel）
 * @param currentWidths - 當前的欄位寬度陣列
 * @param pinnedColumnIndices - 釘選欄位的索引陣列
 * @param tableWidth - 表格的實際寬度（pixel）
 * @returns 轉換後的欄位寬度陣列
 */
export function convertToMixedWidthMode(
  currentWidths: ColumnWidth[],
  pinnedColumnIndices: number[],
  tableWidth: number,
): ColumnWidth[] {
  if (pinnedColumnIndices.length === 0 || tableWidth === 0) {
    return currentWidths;
  }

  const newWidths: ColumnWidth[] = [];

  // 計算釘選欄位的總百分比
  let totalPinnedPercentage = 0;

  pinnedColumnIndices.forEach((index) => {
    const width = currentWidths[index];

    if (width) {
      if (width.type === 'percentage') {
        totalPinnedPercentage += width.value;
      } else {
        // 如果是 pixel，轉換為百分比
        const percentage = (width.value / tableWidth) * 100;

        totalPinnedPercentage += percentage;
      }
    }
  });

  // 確保釘選欄位總和不超過指定範圍
  if (totalPinnedPercentage > MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE) {
    const scaleFactor = MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE / totalPinnedPercentage;

    totalPinnedPercentage = MAX_PINNED_COLUMNS_WIDTH_PERCENTAGE;

    // 調整釘選欄位的百分比
    currentWidths.forEach((width, index) => {
      if (pinnedColumnIndices.includes(index)) {
        if (width.type === 'percentage') {
          currentWidths[index] = {
            type: 'percentage',
            value: Math.round(width.value * scaleFactor * 10) / 10,
          };
        } else {
          const percentage = (width.value / tableWidth) * 100;

          currentWidths[index] = {
            type: 'percentage',
            value: Math.round(percentage * scaleFactor * 10) / 10,
          };
        }
      }
    });
  }

  // 計算剩餘空間（用於未釘選欄位）
  const remainingPercentage = 100 - totalPinnedPercentage;
  const remainingPixelWidth = (tableWidth * remainingPercentage) / 100;
  const unpinnedColumnCount = currentWidths.length - pinnedColumnIndices.length;
  const pixelWidthPerColumn = unpinnedColumnCount > 0 ? Math.floor(remainingPixelWidth / unpinnedColumnCount) : 0;

  // 建立新的寬度陣列
  currentWidths.forEach((width, index) => {
    if (pinnedColumnIndices.includes(index)) {
      // 釘選欄位：使用 percentage
      newWidths.push(width);
    } else {
      // 未釘選欄位：使用 pixel
      newWidths.push({ type: 'pixel', value: pixelWidthPerColumn });
    }
  });

  return newWidths;
}
