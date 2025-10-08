import { ColumnWidth } from './typings';

/**
 * 將 ColumnWidth 轉換為 CSS 可用的字串
 * @param width - 欄位寬度定義
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
 * @param columnWidths - 欄位寬度陣列
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

  // 混合模式：有 percentage 也有 pixel
  // 使用 calc() 來結合兩者
  return `calc(${totalPercentage.toFixed(1)}% + ${totalPixels}px)`;
}
