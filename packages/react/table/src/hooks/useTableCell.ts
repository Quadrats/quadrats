import { usePreviousValue } from '@quadrats/react/utils';
import { Editor, Element, Node, PARAGRAPH_TYPE, Transforms } from '@quadrats/core';
import { useCallback, useEffect, useMemo } from 'react';
import { ReactEditor, useFocused } from 'slate-react';
import { useTableState } from './useTableState';
import { useTableMetadata } from './useTableMetadata';
import { TableElement } from '@quadrats/common/table';
import { createList, LIST_TYPES, ListRootTypeKey } from '@quadrats/common/list';
import { QuadratsReactEditor } from '@quadrats/react';
import { AlignValue } from '@quadrats/common/align';
import { getTableStructure, collectCells, setAlignForCells, getAlignFromCells } from '../utils/helper';

/** 檢查 table cell 是否在 focused 狀態 */
export function useTableCellFocused(element: TableElement, editor: QuadratsReactEditor): boolean {
  const { tableSelectedOn, setTableHoveredOn, setTableSelectedOn } = useTableState();
  const cellPath = ReactEditor.findPath(editor, element);
  const focused = useFocused();

  const isCellFocused = useMemo(() => {
    if (!focused || !editor.selection || tableSelectedOn?.region) return false;

    try {
      const selectionPath = editor.selection.anchor.path;

      return (
        selectionPath.length > cellPath.length &&
        selectionPath.slice(0, cellPath.length).every((segment, index) => segment === cellPath[index])
      );
    } catch (error) {
      return false;
    }
  }, [focused, editor.selection, cellPath, tableSelectedOn]);

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
export function useTableCellPosition(element: TableElement, _editor: QuadratsReactEditor) {
  const { cellPositions } = useTableMetadata();

  const cellPosition = useMemo(() => {
    const position = cellPositions.get(element);

    if (position) {
      return position;
    }

    return { columnIndex: -1, rowIndex: -1 };
  }, [cellPositions, element]);

  return cellPosition;
}

/** 轉換 paragraph, order list, un-order list */
export function useTableCellTransformContent(element: TableElement, editor: QuadratsReactEditor) {
  const splitContentByNewlines = useCallback(
    (cellPath: number[]) => {
      try {
        const cellNode = Node.get(editor, cellPath);

        if (!Element.isElement(cellNode)) return false;

        let hasChanges = false;
        const nodesToProcess = [...cellNode.children];

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
                  Transforms.removeNodes(editor, { at: contentPath });

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

        // 因為底層結構改變了，取消選取以避免錯誤
        Transforms.deselect(editor);
      } catch (error) {
        console.warn('Failed to transform cell content:', error);
      }
    },
    [editor, element, splitContentByNewlines],
  );

  return transformCellContent;
}

/** 設定 column 或 table 的 align */
export function useTableCellAlign(tableElement: TableElement, editor: QuadratsReactEditor) {
  const setAlign = useCallback(
    (alignValue: AlignValue, scope: 'table' | 'column', columnIndex?: number) => {
      const tableStructure = getTableStructure(editor, tableElement);

      if (!tableStructure) {
        console.warn('Failed to get table structure');

        return;
      }

      // 使用 helper 函數收集 cells
      const cells = collectCells(tableStructure, scope, columnIndex);

      // 使用 helper 函數設定 align
      Editor.withoutNormalizing(editor, () => {
        setAlignForCells(editor, cells, alignValue);
      });
    },
    [editor, tableElement],
  );

  return setAlign;
}

/** 獲取 column 或 table 的 align 狀態 */
export function useTableCellAlignStatus(tableElement: TableElement, editor: QuadratsReactEditor) {
  const getAlign = useCallback(
    (scope: 'table' | 'column', columnIndex?: number): AlignValue => {
      const tableStructure = getTableStructure(editor, tableElement);

      if (!tableStructure) {
        return 'left';
      }

      const cells = collectCells(tableStructure, scope, columnIndex);

      return getAlignFromCells(cells);
    },
    [editor, tableElement],
  );

  return getAlign;
}
