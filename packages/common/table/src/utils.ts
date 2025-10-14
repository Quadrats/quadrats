import { Editor, Element, Transforms } from '@quadrats/core';
import { CellLocation, ColumnWidth, TableContainers, TableElement, TableTypes } from './typings';

/**
 * 將 ColumnWidth 轉換為 CSS 可用的字串
 * @param width - 行寬定義（column width）
 * @returns CSS 寬度字串（例如 "30%" 或 "200px"）
 */
export function columnWidthToCSS(width: ColumnWidth): string {
  if (width.type === 'percentage') {
    return `${width.value.toFixed(1)}%`;
  }

  return `${width.value}px`;
}

/**
 * 計算 table 的總寬度（用於設定 min-width 以支援 overflow）
 * 此函數會將所有 columnWidths 的百分比和 pixel 值加總：
 * - percentage: 保留為百分比
 * - pixel: 直接累加
 *
 * @param columnWidths - 行寬陣列（column widths）
 * @returns 總寬度的 CSS 字串（例如 "calc(50% + 400px)" 或 "100%" 或 "800px"）
 */
export function calculateTableMinWidth(columnWidths: ColumnWidth[]): string {
  if (columnWidths.length === 0) {
    return '100%';
  }

  let totalPercentage = 0;
  let totalPixels = 0;

  columnWidths.forEach((width) => {
    if (width.type === 'percentage') {
      totalPercentage += width.value;
    } else {
      totalPixels += width.value;
    }
  });

  // 只有 percentage，沒有 pixel
  if (totalPixels === 0) {
    return `${totalPercentage.toFixed(1)}%`;
  }

  // 只有 pixel，沒有 percentage
  if (totalPercentage === 0) {
    return `${totalPixels}px`;
  }

  // 有 percentage 也有 pixel
  // 使用 calc() 來結合兩者
  return `calc(${totalPercentage.toFixed(1)}% + ${totalPixels}px)`;
}

/**
 * 獲取 cell 的位置資訊
 * @param editor - Slate editor
 * @param types - Table types
 * @param at - 可選的位置，預設使用 editor.selection
 * @returns cell 的位置資訊，如果找不到則返回 null
 */
export function getCellLocation(editor: Editor, types: TableTypes, at?: any): CellLocation | null {
  const cellEntry = Editor.above(editor, {
    at,
    match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_cell,
  });

  if (!cellEntry) return null;

  const [, cellPath] = cellEntry;
  const columnIndex = cellPath[cellPath.length - 1];

  const rowEntry = Editor.above(editor, {
    at: cellPath,
    match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_row,
  });

  if (!rowEntry) return null;

  const [row, rowPath] = rowEntry;
  const rowIndex = rowPath[rowPath.length - 1];

  const containerEntry = Editor.above(editor, {
    at: rowPath,
    match: (n) => Element.isElement(n) && [types.table_header, types.table_body].includes((n as TableElement).type),
  });

  if (!containerEntry) return null;

  const [container, containerPath] = containerEntry;

  return {
    cellPath,
    columnIndex,
    row,
    rowPath,
    rowIndex,
    container,
    containerPath,
    isHeader: Element.isElement(container) && (container as TableElement).type === types.table_header,
    isBody: Element.isElement(container) && (container as TableElement).type === types.table_body,
  };
}

/**
 * 獲取 table main 和相關容器資訊
 * @param editor - Slate editor
 * @param types - Table types
 * @param containerPath - 當前容器的路徑
 * @returns table 容器資訊，如果找不到則返回 null
 */
export function getTableContainers(editor: Editor, types: TableTypes, containerPath: number[]): TableContainers | null {
  const tableMainEntry = Editor.above(editor, {
    at: containerPath,
    match: (n) => Element.isElement(n) && (n as TableElement).type === types.table_main,
  });

  if (!tableMainEntry) return null;

  const [tableMain, tableMainPath] = tableMainEntry;

  const tableHeader = tableMain.children.find(
    (child) => Element.isElement(child) && (child as TableElement).type === types.table_header,
  ) as TableElement | null;

  const tableBody = tableMain.children.find(
    (child) => Element.isElement(child) && (child as TableElement).type === types.table_body,
  ) as TableElement | null;

  const tableHeaderIndex = tableHeader ? tableMain.children.findIndex((child) => child === tableHeader) : -1;
  const tableBodyIndex = tableBody ? tableMain.children.findIndex((child) => child === tableBody) : -1;

  return {
    tableMain,
    tableMainPath,
    tableHeader,
    tableBody,
    tableHeaderIndex,
    tableBodyIndex,
  };
}

/**
 * 嘗試移動到相鄰列的相同行
 * @param location - 當前 cell 位置資訊
 * @param direction - 移動方向（'up' 或 'down'）
 * @param selectFn - 選擇函數（用於 move 或 extend 模式）
 * @returns 是否成功移動
 */
export function tryMoveToAdjacentRow(
  location: CellLocation,
  direction: 'up' | 'down',
  selectFn: (cellPath: number[], position: 'start' | 'end') => void,
): boolean {
  const { container, containerPath, rowIndex, columnIndex } = location;
  const targetRowIndex = direction === 'up' ? rowIndex - 1 : rowIndex + 1;

  // 嘗試在當前容器中移動
  if (targetRowIndex >= 0 && targetRowIndex < container.children.length) {
    const targetRow = container.children[targetRowIndex];

    if (Element.isElement(targetRow)) {
      const targetColumnIndex = Math.min(columnIndex, targetRow.children.length - 1);
      const targetCellPath = [...containerPath, targetRowIndex, targetColumnIndex];

      selectFn(targetCellPath, direction === 'up' ? 'start' : 'end');

      return true;
    }
  }

  return false;
}

/**
 * 嘗試跨容器移動（header <-> body）
 * @param containers - Table 容器資訊
 * @param location - 當前 cell 位置資訊
 * @param direction - 移動方向（'up' 或 'down'）
 * @param selectFn - 選擇函數（用於 move 或 extend 模式）
 * @param targetColumn - 目標行索引，預設為保持當前行，設為 0 可強制移動到第一行
 * @returns 是否成功移動
 */
export function tryCrossBoundaryMove(
  containers: TableContainers,
  location: CellLocation,
  direction: 'up' | 'down',
  selectFn: (cellPath: number[], position: 'start' | 'end') => void,
  targetColumn?: number,
): boolean {
  const { columnIndex, isHeader, isBody } = location;
  const { tableMainPath, tableHeader, tableBody, tableHeaderIndex, tableBodyIndex } = containers;

  // 從 body 向上移動到 header
  if (direction === 'up' && isBody && tableHeader && Element.isElement(tableHeader)) {
    const lastRowIndex = tableHeader.children.length - 1;
    const lastRow = tableHeader.children[lastRowIndex];

    if (Element.isElement(lastRow)) {
      const targetColumnIndex =
        targetColumn !== undefined ? targetColumn : Math.min(columnIndex, lastRow.children.length - 1);

      const targetCellPath = [...tableMainPath, tableHeaderIndex, lastRowIndex, targetColumnIndex];

      selectFn(targetCellPath, 'start');

      return true;
    }
  }

  // 從 header 向下移動到 body
  if (direction === 'down' && isHeader && tableBody && Element.isElement(tableBody)) {
    const firstRow = tableBody.children[0];

    if (Element.isElement(firstRow)) {
      const targetColumnIndex =
        targetColumn !== undefined ? targetColumn : Math.min(columnIndex, firstRow.children.length - 1);

      const targetCellPath = [...tableMainPath, tableBodyIndex, 0, targetColumnIndex];

      // Tab 導航時使用 'start'，上下鍵導航時使用 'end'
      const position = targetColumn === 0 ? 'start' : 'end';

      selectFn(targetCellPath, position);

      return true;
    }
  }

  return false;
}

/**
 * 嘗試移動到下一個 cell
 * @param location - 當前 cell 位置資訊
 * @param selectFn - 選擇函數
 * @returns 是否成功移動
 */
export function tryMoveToNextCell(
  location: CellLocation,
  selectFn: (cellPath: number[], position: 'start' | 'end') => void,
): boolean {
  const { cellPath, row, rowPath, container, containerPath, rowIndex } = location;
  const currentColumnIndex = cellPath[cellPath.length - 1];
  const nextColumnIndex = currentColumnIndex + 1;

  if (nextColumnIndex < row.children.length) {
    const targetCellPath = [...rowPath, nextColumnIndex];

    selectFn(targetCellPath, 'start');

    return true;
  }

  const nextRowIndex = rowIndex + 1;

  if (nextRowIndex < container.children.length) {
    const nextRow = container.children[nextRowIndex];

    if (Element.isElement(nextRow) && nextRow.children.length > 0) {
      const targetCellPath = [...containerPath, nextRowIndex, 0];

      selectFn(targetCellPath, 'start');

      return true;
    }
  }

  return false;
}

/**
 * 嘗試在水平方向擴展選擇（左右移動）
 * @param editor - Slate editor
 * @param location - 當前 cell 位置資訊
 * @param direction - 移動方向（'left' 或 'right'）
 * @param anchor - 選擇的起點
 * @returns 是否成功擴展
 */
export function tryExtendSelectionHorizontal(
  editor: Editor,
  location: CellLocation,
  direction: 'left' | 'right',
  anchor: any,
): boolean {
  const { cellPath, columnIndex, row, rowPath } = location;
  const focus = editor.selection?.focus;

  if (!focus) return false;

  const isLeftDirection = direction === 'left';
  const isAtBoundary = isLeftDirection ? columnIndex === 0 : columnIndex >= row.children.length - 1;

  // 如果已經在邊界，嘗試擴展到該 cell 的開頭或結尾
  if (isAtBoundary) {
    const boundaryPoint = isLeftDirection ? Editor.start(editor, cellPath) : Editor.end(editor, cellPath);

    // 只有當 focus 還沒到邊界時才移動
    const shouldMove = isLeftDirection
      ? focus.offset > boundaryPoint.offset || focus.path.length !== boundaryPoint.path.length
      : focus.offset < boundaryPoint.offset || focus.path.length !== boundaryPoint.path.length;

    if (shouldMove) {
      Transforms.select(editor, { anchor, focus: boundaryPoint });
    }

    return true;
  }

  // 找到目標 cell
  const targetColumnIndex = isLeftDirection ? columnIndex - 1 : columnIndex + 1;
  const targetCellPath = [...rowPath, targetColumnIndex];

  // 根據方向選擇目標點（左邊用 end，右邊用 start）
  const targetPoint = isLeftDirection ? Editor.end(editor, targetCellPath) : Editor.start(editor, targetCellPath);

  // 保持 anchor 不變，移動 focus
  Transforms.select(editor, { anchor, focus: targetPoint });

  return true;
}
