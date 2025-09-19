import { usePreviousValue } from '@quadrats/react/utils';
import { Editor, Element, Node, PARAGRAPH_TYPE, Transforms } from '@quadrats/core';
import { useCallback, useEffect, useMemo } from 'react';
import { ReactEditor, useFocused, useSlateStatic } from 'slate-react';
import { useTable } from './useTable';
import {
  TABLE_BODY_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_ROW_TYPE,
  TableElement,
} from '@quadrats/common/table';
import { createList, LIST_TYPES, ListRootTypeKey } from '@quadrats/common/list';

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

/** 轉換 paragraph, order list, un-order list */
export function useTableCellTransformContent(element: TableElement) {
  const editor = useSlateStatic();

  const splitContentByNewlines = useCallback(
    (cellPath: number[]) => {
      try {
        const cellNode = Node.get(editor, cellPath);

        if (!Element.isElement(cellNode)) return false;

        let hasChanges = false;
        const nodesToProcess = [...cellNode.children]; // Create a snapshot

        // Process each content node in reverse order to maintain indices
        for (let contentIndex = nodesToProcess.length - 1; contentIndex >= 0; contentIndex--) {
          const contentNode = nodesToProcess[contentIndex];

          if (Element.isElement(contentNode)) {
            const textContent = Node.string(contentNode);

            if (textContent.includes('\n')) {
              const contentPath = [...cellPath, contentIndex];

              // Verify the path is still valid
              try {
                const currentNode = Node.get(editor, contentPath);

                if (!currentNode) continue;
              } catch {
                continue;
              }

              // Split by newlines and filter out empty strings
              const lines = textContent.split('\n').filter((line) => line.trim() !== '');

              if (lines.length > 1) {
                hasChanges = true;

                // Use Editor.withoutNormalizing to batch operations
                Editor.withoutNormalizing(editor, () => {
                  // Remove the original content node
                  Transforms.removeNodes(editor, { at: contentPath });

                  // Insert new paragraph nodes for each line
                  lines.forEach((line, lineIndex) => {
                    const newParagraph = {
                      type: PARAGRAPH_TYPE,
                      children: [{ text: line.trim() }],
                    };

                    Transforms.insertNodes(editor, newParagraph, {
                      at: [...cellPath, contentIndex + lineIndex],
                    });
                  });
                });
              }
            }
          }
        }

        return hasChanges;
      } catch (error) {
        console.warn('Failed to split content by newlines:', error);

        return false;
      }
    },
    [editor],
  );

  const transformCellContent = useCallback(
    (elementType: string) => {
      try {
        const cellPath = ReactEditor.findPath(editor, element);
        const listHelper = createList();

        if (elementType === LIST_TYPES.ol || elementType === LIST_TYPES.ul) {
          /** 將 paragraph 的換行符號轉換成 list item */
          const wasSplit = splitContentByNewlines(cellPath);

          if (wasSplit) {
            Editor.normalize(editor, { force: true });
          }
        }

        // 選擇整個儲存格內容
        const cellStartPoint = Editor.start(editor, cellPath);
        const cellEndPoint = Editor.end(editor, cellPath);

        Transforms.select(editor, { anchor: cellStartPoint, focus: cellEndPoint });

        if (elementType === LIST_TYPES.ol || elementType === LIST_TYPES.ul) {
          listHelper.toggleList(editor, elementType as ListRootTypeKey, PARAGRAPH_TYPE);
        } else if (elementType === PARAGRAPH_TYPE) {
          const cellNode = Node.get(editor, cellPath);

          if (Element.isElement(cellNode)) {
            const currentListElement = cellNode.children.find(
              (child) => Element.isElement(child) && [LIST_TYPES.ol, LIST_TYPES.ul].includes(child.type),
            );

            if (currentListElement && Element.isElement(currentListElement)) {
              listHelper.toggleList(editor, currentListElement.type as ListRootTypeKey, PARAGRAPH_TYPE);
            }
          }
        }

        Transforms.deselect(editor);
      } catch (error) {
        console.warn('Failed to transform cell content:', error);
      }
    },
    [editor, element, splitContentByNewlines],
  );

  return transformCellContent;
}
