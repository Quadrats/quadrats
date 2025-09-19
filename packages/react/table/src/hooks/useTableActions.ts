import { useCallback } from 'react';
import { Element, PARAGRAPH_TYPE, Transforms, Editor } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { RenderTableElementProps, TableContextType } from '../typings';
import {
  TABLE_BODY_TYPE,
  TABLE_CELL_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_DEFAULT_MAX_COLUMNS,
  TABLE_ROW_TYPE,
} from '@quadrats/common/table';
import { useQuadrats } from '@quadrats/react';

export function useTableActions(element: RenderTableElementProps['element']) {
  const editor = useQuadrats();

  const addColumn: TableContextType['addColumn'] = useCallback(
    (options = {}) => {
      const { position = 'right', columnIndex, treatAsTitle } = options;

      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Check column limit
        const firstRow = tableBodyElement.children[0];

        if (Element.isElement(firstRow) && firstRow.children.length >= TABLE_DEFAULT_MAX_COLUMNS) {
          console.warn(`Maximum columns limit (${TABLE_DEFAULT_MAX_COLUMNS}) reached`);

          return;
        }

        // Calculate insertion index
        let insertIndex: number;

        if (typeof columnIndex === 'number' && Element.isElement(firstRow)) {
          // Use provided index
          if (position === 'left') {
            insertIndex = Math.max(0, columnIndex);
          } else {
            insertIndex = Math.min(firstRow.children.length, columnIndex + 1);
          }
        } else if (Element.isElement(firstRow)) {
          // Default behavior: append at the end
          insertIndex = firstRow.children.length;
        } else {
          console.warn('Failed to determine insertion index: no valid first row found');

          return;
        }

        // Add cell to each row in header
        if (Element.isElement(tableHeaderElement) && tableHeaderElement.children.length > 0) {
          const tableHeaderPath = ReactEditor.findPath(editor, tableHeaderElement);

          tableHeaderElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const newCell = {
                type: TABLE_CELL_TYPE,
                treatAsTitle,
                children: [
                  {
                    type: PARAGRAPH_TYPE,
                    children: [{ text: '' }],
                  },
                ],
              };

              const rowPath = [...tableHeaderPath, rowIndex];
              const cellPath = [...rowPath, insertIndex];

              Transforms.insertNodes(editor, newCell, { at: cellPath });
            }
          });
        }

        // Add cell to each row in body
        const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);

        tableBodyElement.children.forEach((row, rowIndex) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            const newCell = {
              type: TABLE_CELL_TYPE,
              treatAsTitle,
              children: [
                {
                  type: PARAGRAPH_TYPE,
                  children: [{ text: '' }],
                },
              ],
            };

            const rowPath = [...tableBodyPath, rowIndex];
            const cellPath = [...rowPath, insertIndex];

            Transforms.insertNodes(editor, newCell, { at: cellPath });
          }
        });
      } catch (error) {
        console.warn('Failed to add column:', error);
      }
    },
    [editor, element],
  );

  const addRow: TableContextType['addRow'] = useCallback(
    (options = {}) => {
      const { position = 'bottom', rowIndex } = options;

      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        const firstRow = tableBodyElement.children[0];

        if (!Element.isElement(firstRow) || !firstRow.type.includes(TABLE_ROW_TYPE)) return;

        const columnCount = firstRow.children.length;

        // Check which columns are title columns by examining existing rows
        const columnTitleStatus: boolean[] = Array.from({ length: columnCount }, () => false);

        // Check all existing rows to determine title column status
        const allRows = [
          ...(tableHeaderElement && Element.isElement(tableHeaderElement) ? tableHeaderElement.children : []),
          ...tableBodyElement.children,
        ];

        allRows.forEach((row) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            row.children.forEach((cell, cellIndex) => {
              if (
                Element.isElement(cell) &&
                cell.type.includes(TABLE_CELL_TYPE) &&
                cell.treatAsTitle &&
                cellIndex < columnCount
              ) {
                columnTitleStatus[cellIndex] = true;
              }
            });
          }
        });

        // Create new row with appropriate treatAsTitle properties
        const newRow = {
          type: TABLE_ROW_TYPE,
          children: Array.from({ length: columnCount }, (_, index) => ({
            type: TABLE_CELL_TYPE,
            children: [
              {
                type: PARAGRAPH_TYPE,
                children: [{ text: '' }],
              },
            ],
            ...(columnTitleStatus[index] ? { treatAsTitle: true } : {}),
          })),
        };

        // Determine where to insert the row
        if (typeof rowIndex === 'number') {
          const totalHeaderRows =
            tableHeaderElement && Element.isElement(tableHeaderElement)
              ? tableHeaderElement.children.filter(
                  (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
                ).length
              : 0;

          // Check if we're inserting in header region
          if (Element.isElement(tableHeaderElement) && rowIndex < totalHeaderRows) {
            const headerPath = ReactEditor.findPath(editor, tableHeaderElement);
            let insertIndex: number;

            if (position === 'top') {
              insertIndex = Math.max(0, rowIndex);
            } else {
              insertIndex = Math.min(totalHeaderRows, rowIndex + 1);
            }

            const newRowPath = [...headerPath, insertIndex];

            Transforms.insertNodes(editor, newRow, { at: newRowPath });

            return;
          }

          // Inserting in body region - adjust rowIndex
          const bodyRowIndex = rowIndex - totalHeaderRows;
          const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
          let insertIndex: number;

          if (position === 'top') {
            insertIndex = Math.max(0, bodyRowIndex);
          } else {
            insertIndex = Math.min(tableBodyElement.children.length, bodyRowIndex + 1);
          }

          const newRowPath = [...tableBodyPath, insertIndex];

          Transforms.insertNodes(editor, newRow, { at: newRowPath });
        } else {
          // Default behavior: append at the end of body
          const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
          const insertIndex = tableBodyElement.children.length;
          const newRowPath = [...tableBodyPath, insertIndex];

          Transforms.insertNodes(editor, newRow, { at: newRowPath });
        }
      } catch (error) {
        console.warn('Failed to add row:', error);
      }
    },
    [editor, element],
  );

  const addColumnAndRow: TableContextType['addColumnAndRow'] = useCallback(() => {
    try {
      const tableMainElement = element.children.find(
        (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
      );

      if (!tableMainElement || !Element.isElement(tableMainElement)) return;

      const tableBodyElement = tableMainElement.children.find(
        (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
      );

      const tableHeaderElement = tableMainElement.children.find(
        (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
      );

      if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

      // Check both column and row limits
      const firstRow = tableBodyElement.children[0];

      if (Element.isElement(firstRow) && firstRow.children.length >= TABLE_DEFAULT_MAX_COLUMNS) {
        console.warn(`Maximum columns limit (${TABLE_DEFAULT_MAX_COLUMNS}) reached`);

        return;
      }

      // Use Editor.withoutNormalizing to batch all operations
      editor.withoutNormalizing(() => {
        // First, add column to header if it exists
        if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
          const headerPath = ReactEditor.findPath(editor, tableHeaderElement);

          tableHeaderElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const newHeaderCell = {
                type: TABLE_CELL_TYPE,
                children: [
                  {
                    type: PARAGRAPH_TYPE,
                    children: [{ text: '' }],
                  },
                ],
              };

              const rowPath = [...headerPath, rowIndex];
              const cellPath = [...rowPath, row.children.length];

              Transforms.insertNodes(editor, newHeaderCell, { at: cellPath });
            }
          });
        }

        // Then, add column to each existing row in body
        const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);

        tableBodyElement.children.forEach((row, rowIndex) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            const newCell = {
              type: TABLE_CELL_TYPE,
              children: [
                {
                  type: PARAGRAPH_TYPE,
                  children: [{ text: '' }],
                },
              ],
            };

            const rowPath = [...tableBodyPath, rowIndex];
            const cellPath = [...rowPath, row.children.length];

            Transforms.insertNodes(editor, newCell, { at: cellPath });
          }
        });

        // Finally, add a new row with the updated column count
        if (Element.isElement(firstRow)) {
          const newColumnCount = firstRow.children.length + 1; // +1 because we just added a column

          // Check which columns are title columns by examining existing rows
          const columnTitleStatus: boolean[] = Array.from({ length: newColumnCount }, () => false);

          // Check all existing rows to determine title column status
          const allRows = [
            ...(tableHeaderElement && Element.isElement(tableHeaderElement) ? tableHeaderElement.children : []),
            ...tableBodyElement.children,
          ];

          allRows.forEach((row) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              row.children.forEach((cell, cellIndex) => {
                if (
                  Element.isElement(cell) &&
                  cell.type.includes(TABLE_CELL_TYPE) &&
                  cell.treatAsTitle &&
                  cellIndex < newColumnCount - 1 // Exclude the newly added column
                ) {
                  columnTitleStatus[cellIndex] = true;
                }
              });
            }
          });

          // The newly added column (last one) is not a title column by default
          columnTitleStatus[newColumnCount - 1] = false;

          const newRow = {
            type: TABLE_ROW_TYPE,
            children: Array.from({ length: newColumnCount }, (_, index) => ({
              type: TABLE_CELL_TYPE,
              children: [
                {
                  type: PARAGRAPH_TYPE,
                  children: [{ text: '' }],
                },
              ],
              ...(columnTitleStatus[index] ? { treatAsTitle: true } : {}),
            })),
          };

          const newRowPath = [...tableBodyPath, tableBodyElement.children.length];

          Transforms.insertNodes(editor, newRow, { at: newRowPath });
        }
      });
    } catch (error) {
      console.warn('Failed to add column and row:', error);
    }
  }, [editor, element]);

  const deleteRow: TableContextType['deleteRow'] = useCallback(
    (rowIndex) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        // Calculate the total number of header rows
        let totalHeaderRows = 0;

        if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
          totalHeaderRows = tableHeaderElement.children.filter(
            (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
          ).length;
        }

        // Check if we're trying to delete a header row
        if (rowIndex < totalHeaderRows) {
          // Delete a specific header row
          const headerPath = ReactEditor.findPath(editor, tableHeaderElement!);
          const headerRowPath = [...headerPath, rowIndex];

          Transforms.removeNodes(editor, { at: headerRowPath });

          // If this was the last header row, remove the entire header element
          if (totalHeaderRows <= 1) {
            Transforms.removeNodes(editor, { at: headerPath });
          }

          return;
        }

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Calculate the body row index (subtract total header rows)
        const bodyRowIndex = rowIndex - totalHeaderRows;

        // Check if the body row index is valid
        if (bodyRowIndex < 0 || bodyRowIndex >= tableBodyElement.children.length) {
          console.warn('Invalid row index for deletion');

          return;
        }

        // Don't allow deleting the last remaining row
        if (tableBodyElement.children.length <= 1) {
          console.warn('Cannot delete the last row');

          return;
        }

        const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
        const rowPath = [...tableBodyPath, bodyRowIndex];

        Transforms.removeNodes(editor, { at: rowPath });
      } catch (error) {
        console.warn('Failed to delete row:', error);
      }
    },
    [editor, element],
  );

  const deleteColumn: TableContextType['deleteColumn'] = useCallback(
    (columnIndex) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Check if we have enough columns (don't allow deleting the last column)
        const firstRow = tableBodyElement.children[0];

        if (!Element.isElement(firstRow) || firstRow.children.length <= 1) {
          console.warn('Cannot delete the last column');

          return;
        }

        // Check if columnIndex is valid
        if (columnIndex < 0 || columnIndex >= firstRow.children.length) {
          console.warn('Invalid column index for deletion');

          return;
        }

        editor.withoutNormalizing(() => {
          // Delete column from header if it exists
          if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
            const headerPath = ReactEditor.findPath(editor, tableHeaderElement);

            // Delete column from each row in header (in reverse order to maintain indices)
            for (let rowIndex = tableHeaderElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const headerRow = tableHeaderElement.children[rowIndex];

              if (Element.isElement(headerRow) && headerRow.type.includes(TABLE_ROW_TYPE)) {
                const headerCellPath = [...headerPath, rowIndex, columnIndex];

                Transforms.removeNodes(editor, { at: headerCellPath });
              }
            }
          }

          // Delete column from each row in body (in reverse order to maintain indices)
          const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);

          for (let rowIndex = tableBodyElement.children.length - 1; rowIndex >= 0; rowIndex--) {
            const row = tableBodyElement.children[rowIndex];

            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cellPath = [...tableBodyPath, rowIndex, columnIndex];

              Transforms.removeNodes(editor, { at: cellPath });
            }
          }
        });
      } catch (error) {
        console.warn('Failed to delete column:', error);
      }
    },
    [editor, element],
  );

  const moveRowToBody: TableContextType['moveRowToBody'] = useCallback(
    (rowIndex: number) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (
          !tableBodyElement ||
          !Element.isElement(tableBodyElement) ||
          !tableHeaderElement ||
          !Element.isElement(tableHeaderElement)
        )
          return;

        // Check if the row exists in header (rowIndex should be within header range)
        if (rowIndex >= tableHeaderElement.children.length) {
          console.warn('Invalid header row index:', rowIndex);

          return;
        }

        const rowToMove = tableHeaderElement.children[rowIndex];

        if (!Element.isElement(rowToMove) || !rowToMove.type.includes(TABLE_ROW_TYPE)) return;

        const tableHeaderPath = ReactEditor.findPath(editor, tableHeaderElement);
        const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
        const rowPath = [...tableHeaderPath, rowIndex];

        // Move row to the end of body
        const bodyTargetPath = [...tableBodyPath, tableBodyElement.children.length];

        Transforms.moveNodes(editor, {
          at: rowPath,
          to: bodyTargetPath,
        });
      } catch (error) {
        console.warn('Failed to move row to body:', error);
      }
    },
    [editor, element],
  );

  const moveRowToHeader: TableContextType['moveRowToHeader'] = useCallback(
    (rowIndex: number) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Calculate the correct body row index
        const headerRowCount =
          tableHeaderElement && Element.isElement(tableHeaderElement) ? tableHeaderElement.children.length : 0;

        const bodyRowIndex = rowIndex - headerRowCount;

        // Check if the body row index is valid
        if (bodyRowIndex < 0 || bodyRowIndex >= tableBodyElement.children.length) {
          console.warn('Invalid body row index:', bodyRowIndex);

          return;
        }

        // Check if the row exists
        const rowToMove = tableBodyElement.children[bodyRowIndex];

        if (!Element.isElement(rowToMove) || !rowToMove.type.includes(TABLE_ROW_TYPE)) return;

        const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
        const rowPath = [...tableBodyPath, bodyRowIndex];

        // If header doesn't exist, create it first
        if (!tableHeaderElement || !Element.isElement(tableHeaderElement)) {
          // Create header with the row directly to avoid normalizeNode removing empty header
          const newHeader = {
            type: TABLE_HEADER_TYPE,
            children: [rowToMove], // 直接把 row 放進新 header 中
          };

          const tableMainPath = ReactEditor.findPath(editor, tableMainElement);
          const headerInsertPath = [...tableMainPath, 0];

          // Use withoutNormalizing to prevent interference during the operation
          Editor.withoutNormalizing(editor, () => {
            // Remove the row from body first
            Transforms.removeNodes(editor, { at: rowPath });

            // Insert new header with the row
            Transforms.insertNodes(editor, newHeader, { at: headerInsertPath });
          });
        } else {
          // Move row to the end of existing header
          const tableHeaderPath = ReactEditor.findPath(editor, tableHeaderElement);
          const headerTargetPath = [...tableHeaderPath, tableHeaderElement.children.length];

          Transforms.moveNodes(editor, {
            at: rowPath,
            to: headerTargetPath,
          });
        }
      } catch (error) {
        console.warn('Failed to move row to header:', error);
      }
    },
    [editor, element],
  );

  const unsetColumnAsTitle: TableContextType['unsetColumnAsTitle'] = useCallback(
    (columnIndex: number) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Function to process a container (header or body)
        const processContainer = (containerElement: Element) => {
          if (!Element.isElement(containerElement)) return;

          const containerPath = ReactEditor.findPath(editor, containerElement);

          // Find the target insertion index (after all remaining title columns)
          let targetColumnIndex = 0;

          // Check first row to find where non-title columns should start
          const firstRow = containerElement.children[0];

          if (Element.isElement(firstRow) && firstRow.type.includes(TABLE_ROW_TYPE)) {
            // Count title columns (excluding the one we're unsetting)
            for (let i = 0; i < firstRow.children.length; i++) {
              const cell = firstRow.children[i];

              if (
                Element.isElement(cell) &&
                cell.type.includes(TABLE_CELL_TYPE) &&
                (cell as any).treatAsTitle &&
                i !== columnIndex // Exclude the column we're unsetting
              ) {
                targetColumnIndex = i + 1;
              }
            }
          }

          // Unset treatAsTitle for all cells in the column first
          containerElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cell = row.children[columnIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                const cellPath = [...containerPath, rowIndex, columnIndex];

                Transforms.unsetNodes(editor, 'treatAsTitle', { at: cellPath });
              }
            }
          });

          // Move the column to the end of title columns if needed
          if (columnIndex < targetColumnIndex) {
            // We need to move the column to position targetColumnIndex
            // Since we're moving from left to right, we need to adjust for the removed column
            const actualTargetIndex = targetColumnIndex - 1;

            // Move each cell in the column to the new position
            // Note: We need to move from bottom to top to avoid path conflicts
            for (let rowIndex = containerElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const row = containerElement.children[rowIndex];

              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const fromPath = [...containerPath, rowIndex, columnIndex];
                const toPath = [...containerPath, rowIndex, actualTargetIndex];

                Transforms.moveNodes(editor, {
                  at: fromPath,
                  to: toPath,
                });
              }
            }
          }
        };

        // Process header if it exists
        if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
          processContainer(tableHeaderElement);
        }

        // Process body
        processContainer(tableBodyElement);
      } catch (error) {
        console.warn('Failed to unset column as title:', error);
      }
    },
    [editor, element],
  );

  const setColumnAsTitle: TableContextType['setColumnAsTitle'] = useCallback(
    (columnIndex: number) => {
      try {
        const tableMainElement = element.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!tableMainElement || !Element.isElement(tableMainElement)) return;

        const tableBodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        const tableHeaderElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

        // Function to process a container (header or body)
        const processContainer = (containerElement: Element) => {
          if (!Element.isElement(containerElement)) return;

          const containerPath = ReactEditor.findPath(editor, containerElement);

          // Find the target insertion index for title columns
          let targetColumnIndex = 0;

          // Check first row to find existing title columns
          const firstRow = containerElement.children[0];

          if (Element.isElement(firstRow) && firstRow.type.includes(TABLE_ROW_TYPE)) {
            // Count existing title columns to determine insertion position
            for (let i = 0; i < firstRow.children.length; i++) {
              const cell = firstRow.children[i];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE) && (cell as any).treatAsTitle) {
                targetColumnIndex = i + 1;
              } else {
                break; // Stop at first non-title column
              }
            }
          }

          // If the column is already a title column and at the correct position, just set the property
          if (
            Element.isElement(firstRow) &&
            firstRow.type.includes(TABLE_ROW_TYPE) &&
            columnIndex < targetColumnIndex
          ) {
            // Just ensure all cells in this column have treatAsTitle: true
            containerElement.children.forEach((row, rowIndex) => {
              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const cell = row.children[columnIndex];

                if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                  const cellPath = [...containerPath, rowIndex, columnIndex];

                  Transforms.setNodes(editor, { treatAsTitle: true } as Partial<Element>, { at: cellPath });
                }
              }
            });

            return;
          }

          // Set treatAsTitle for all cells in the column first
          containerElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const cell = row.children[columnIndex];

              if (Element.isElement(cell) && cell.type.includes(TABLE_CELL_TYPE)) {
                const cellPath = [...containerPath, rowIndex, columnIndex];

                Transforms.setNodes(editor, { treatAsTitle: true } as Partial<Element>, { at: cellPath });
              }
            }
          });

          // Move the column to the correct position if needed
          if (columnIndex !== targetColumnIndex) {
            // Move each cell in the column to the new position
            // Note: We need to move from bottom to top to avoid path conflicts
            for (let rowIndex = containerElement.children.length - 1; rowIndex >= 0; rowIndex--) {
              const row = containerElement.children[rowIndex];

              if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
                const fromPath = [...containerPath, rowIndex, columnIndex];
                const toPath = [...containerPath, rowIndex, targetColumnIndex];

                Transforms.moveNodes(editor, {
                  at: fromPath,
                  to: toPath,
                });
              }
            }
          }
        };

        // Process header if it exists
        if (tableHeaderElement && Element.isElement(tableHeaderElement)) {
          processContainer(tableHeaderElement);
        }

        // Process body
        processContainer(tableBodyElement);
      } catch (error) {
        console.warn('Failed to set column as title:', error);
      }
    },
    [editor, element],
  );

  return {
    addColumn,
    addRow,
    addColumnAndRow,
    deleteRow,
    deleteColumn,
    moveRowToBody,
    moveRowToHeader,
    unsetColumnAsTitle,
    setColumnAsTitle,
  };
}
