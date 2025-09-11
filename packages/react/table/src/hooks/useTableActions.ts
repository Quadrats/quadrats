import { useCallback } from 'react';
import { Element, Transforms } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { RenderTableElementProps, TableContextType } from '../typings';
import {
  TABLE_BODY_TYPE,
  TABLE_CELL_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_MAX_COLUMNS,
  TABLE_MAX_ROWS,
  TABLE_ROW_TYPE,
} from '@quadrats/common/table';
import { useQuadrats } from '@quadrats/react';

export function useTableActions(element: RenderTableElementProps['element']) {
  const editor = useQuadrats();

  const addColumn: TableContextType['addColumn'] = useCallback(() => {
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

      if (Element.isElement(firstRow) && firstRow.children.length >= TABLE_MAX_COLUMNS) {
        console.warn(`Maximum columns limit (${TABLE_MAX_COLUMNS}) reached`);

        return;
      }

      // Add cell to each row in header
      if (Element.isElement(tableHeaderElement) && tableHeaderElement.children.length > 0) {
        const tableHeaderPath = ReactEditor.findPath(editor, tableHeaderElement);

        tableHeaderElement.children.forEach((row, rowIndex) => {
          if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
            const newCell = {
              type: TABLE_CELL_TYPE,
              children: [{ text: '' }],
            };

            const rowPath = [...tableHeaderPath, rowIndex];
            const cellPath = [...rowPath, row.children.length];

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
            children: [{ text: '' }],
          };

          const rowPath = [...tableBodyPath, rowIndex];
          const cellPath = [...rowPath, row.children.length];

          Transforms.insertNodes(editor, newCell, { at: cellPath });
        }
      });
    } catch (error) {
      console.warn('Failed to add column:', error);
    }
  }, [editor, element]);

  const addRow: TableContextType['addRow'] = useCallback(() => {
    try {
      const tableMainElement = element.children.find(
        (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
      );

      if (!tableMainElement || !Element.isElement(tableMainElement)) return;

      const tableBodyElement = tableMainElement.children.find(
        (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
      );

      if (!tableBodyElement || !Element.isElement(tableBodyElement)) return;

      // Check row limit
      if (tableBodyElement.children.length >= TABLE_MAX_ROWS) {
        console.warn(`Maximum rows limit (${TABLE_MAX_ROWS}) reached`);

        return;
      }

      const firstRow = tableBodyElement.children[0];

      if (!Element.isElement(firstRow) || !firstRow.type.includes(TABLE_ROW_TYPE)) return;

      const columnCount = firstRow.children.length;

      const newRow = {
        type: TABLE_ROW_TYPE,
        children: Array.from({ length: columnCount }, () => ({
          type: TABLE_CELL_TYPE,
          children: [{ text: '' }],
        })),
      };

      const tableBodyPath = ReactEditor.findPath(editor, tableBodyElement);
      const newRowPath = [...tableBodyPath, tableBodyElement.children.length];

      Transforms.insertNodes(editor, newRow, { at: newRowPath });
    } catch (error) {
      console.warn('Failed to add row:', error);
    }
  }, [editor, element]);

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

      if (Element.isElement(firstRow) && firstRow.children.length >= TABLE_MAX_COLUMNS) {
        console.warn(`Maximum columns limit (${TABLE_MAX_COLUMNS}) reached`);

        return;
      }

      if (tableBodyElement.children.length >= TABLE_MAX_ROWS) {
        console.warn(`Maximum rows limit (${TABLE_MAX_ROWS}) reached`);

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
                children: [{ text: '' }],
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
              children: [{ text: '' }],
            };

            const rowPath = [...tableBodyPath, rowIndex];
            const cellPath = [...rowPath, row.children.length];

            Transforms.insertNodes(editor, newCell, { at: cellPath });
          }
        });

        // Finally, add a new row with the updated column count
        if (Element.isElement(firstRow)) {
          const newColumnCount = firstRow.children.length + 1; // +1 because we just added a column

          const newRow = {
            type: TABLE_ROW_TYPE,
            children: Array.from({ length: newColumnCount }, () => ({
              type: TABLE_CELL_TYPE,
              children: [{ text: '' }],
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

  const deleteRow = useCallback(
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

  const deleteColumn = useCallback(
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

  return {
    addColumn,
    addRow,
    addColumnAndRow,
    deleteRow,
    deleteColumn,
  };
}
