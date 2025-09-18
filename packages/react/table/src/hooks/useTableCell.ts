import { usePreviousValue } from '@quadrats/react/utils';
import { Element, Node } from '@quadrats/core';
import { useEffect, useMemo } from 'react';
import { ReactEditor, useFocused, useSlateStatic } from 'slate-react';
import { useTable } from './useTable';
import {
  TABLE_BODY_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_ROW_TYPE,
  TableElement,
} from '@quadrats/common/table';

/** 檢查 table cell 是否在 focused 狀態 */
export function useTableCellFocused(element: TableElement): boolean {
  const { setTableHoveredOn, setTableSelectedOn } = useTable();
  const editor = useSlateStatic();
  const cellPath = ReactEditor.findPath(editor, element);
  const focused = useFocused();

  const isCellFocused = useMemo(() => {
    if (!focused || !editor.selection) return false;

    try {
      const selectionPath = editor.selection.anchor.path;

      return (
        selectionPath.length > cellPath.length &&
        selectionPath.slice(0, cellPath.length).every((segment, index) => segment === cellPath[index])
      );
    } catch (error) {
      return false;
    }
  }, [focused, editor.selection, cellPath]);

  const isPreviousCellFocused = usePreviousValue(isCellFocused);

  useEffect(() => {
    if (isCellFocused) {
      setTableHoveredOn(undefined);
    }

    if (isCellFocused && !isPreviousCellFocused) {
      setTableSelectedOn(undefined);
    }
  }, [isCellFocused, isPreviousCellFocused, setTableSelectedOn, setTableHoveredOn]);

  return isCellFocused;
}

/** 取得 table cell 在 table 裡的 columnIndex 及 rowIndex */
export function useTableCellPosition(element: TableElement) {
  const editor = useSlateStatic();
  const cellPath = ReactEditor.findPath(editor, element);
  const cellPosition = useMemo(() => {
    try {
      const rowPath = cellPath.slice(0, -1);
      const rowNode = Node.get(editor, rowPath);

      if (!Element.isElement(rowNode)) {
        return { columnIndex: -1, rowIndex: -1 };
      }

      const columnIndex = cellPath[cellPath.length - 1];
      let rowIndex = -1;

      if (rowNode.type.includes(TABLE_ROW_TYPE)) {
        const tableRowWrapperPath = rowPath.slice(0, -1);
        const tableRowWrapperNode = Node.get(editor, tableRowWrapperPath);

        if (
          !Element.isElement(tableRowWrapperNode) ||
          ![TABLE_BODY_TYPE, TABLE_HEADER_TYPE].includes(tableRowWrapperNode.type)
        ) {
          return { columnIndex, rowIndex: -1 };
        }

        const tableMainPath = tableRowWrapperPath.slice(0, -1);
        const tableMainNode = Node.get(editor, tableMainPath);

        if (!Element.isElement(tableMainNode) || !tableMainNode.type.includes(TABLE_MAIN_TYPE)) {
          return { columnIndex, rowIndex: -1 };
        }

        const rowIndexInWrapper = rowPath[rowPath.length - 1];

        if (tableRowWrapperNode.type.includes(TABLE_HEADER_TYPE)) {
          // This is a header row, rowIndex is just its position within header
          rowIndex = rowIndexInWrapper;
        } else {
          // This is a body row, rowIndex should account for total header rows
          const headerElement = tableMainNode.children.find(
            (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
          );

          let totalHeaderRows = 0;

          if (headerElement && Element.isElement(headerElement)) {
            totalHeaderRows = headerElement.children.filter(
              (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
            ).length;
          }

          rowIndex = rowIndexInWrapper + totalHeaderRows;
        }
      }

      return { columnIndex, rowIndex };
    } catch (error) {
      console.warn('Error calculating cell position:', error);

      return { columnIndex: -1, rowIndex: -1 };
    }
  }, [editor, cellPath]);

  return cellPosition;
}
