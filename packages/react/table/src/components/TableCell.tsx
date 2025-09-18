import React, { useContext } from 'react';
import clsx from 'clsx';
import { RenderElementProps, useSlateStatic } from '@quadrats/react';
import { Element, Node, Transforms, toggleNodesType, PARAGRAPH_TYPE, Editor } from '@quadrats/core';
import { LIST_TYPES, ListRootTypeKey, createList } from '@quadrats/common/list';
import { ReactEditor } from 'slate-react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon } from '@quadrats/react/components';
import {
  AddColumnAtLeft,
  AddColumnAtRight,
  AddRowAtBottom,
  AddRowAtTop,
  Drag,
  OrderedList,
  Paragraph,
  TableRemoveTitle,
  TableSetColumnTitle,
  TableSetRowTitle,
  Trash,
  UnorderedList,
} from '@quadrats/icons';
import {
  TableElement,
  TABLE_ROW_TYPE,
  TABLE_HEADER_TYPE,
  TABLE_MAIN_TYPE,
  TABLE_BODY_TYPE,
} from '@quadrats/common/table';
import { useTable } from '../hooks/useTable';
import { InlineToolbar, ToolbarGroupIcon, ToolbarIcon } from '@quadrats/react/toolbar';
import { useTableCellFocused, useTableCellPosition } from '../hooks/useTableCell';

function TableCell(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;
  const {
    tableSelectedOn,
    setTableSelectedOn,
    tableHoveredOn,
    setTableHoveredOn,
    columnCount,
    rowCount,
    deleteRow,
    deleteColumn,
    addRow,
    addColumn,
    moveRowToBody,
    moveRowToHeader,
    unsetColumnAsTitle,
    setColumnAsTitle,
  } = useTable();

  const { isHeader } = useContext(TableHeaderContext);
  const focused = useTableCellFocused(element);
  const cellPosition = useTableCellPosition(element);
  const editor = useSlateStatic();

  // Helper function to split content by newlines and create separate paragraphs
  const splitContentByNewlines = (cellPath: number[]) => {
    try {
      const cellNode = Node.get(editor, cellPath);

      if (!Element.isElement(cellNode)) return false;

      let hasChanges = false;
      const nodesToProcess = [...cellNode.children]; // Create a snapshot

      // Process each content node in reverse order to maintain indices
      for (let contentIndex = nodesToProcess.length - 1; contentIndex >= 0; contentIndex--) {
        const contentNode = nodesToProcess[contentIndex];

        if (Element.isElement(contentNode)) {
          // Get all text content from this node
          const textContent = Node.string(contentNode);

          // Check if content contains newlines
          if (textContent.includes('\n')) {
            const contentPath = [...cellPath, contentIndex];

            // Verify the path is still valid
            try {
              const currentNode = Node.get(editor, contentPath);

              if (!currentNode) continue;
            } catch {
              continue; // Skip if path is invalid
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
  };

  // Helper function to transform content inside a cell
  const transformCellContent = (cellPath: number[], elementType: string) => {
    try {
      // Use Editor.withoutNormalizing to batch all operations
      Editor.withoutNormalizing(editor, () => {
        // For list types, first split content by newlines if needed
        if (elementType === LIST_TYPES.ol || elementType === LIST_TYPES.ul) {
          const wasSplit = splitContentByNewlines(cellPath);
          // If content was split, we need to re-fetch the cell node

          if (wasSplit) {
            // Normalize once after splitting to ensure consistent state
            Editor.normalize(editor, { force: true });
          }
        }

        // Re-fetch the cell node after potential splitting
        const cellNode = Node.get(editor, cellPath);

        if (!Element.isElement(cellNode)) return;

        // Store the original selection
        const previousSelection = editor.selection;

        // Create a list helper instance
        const listHelper = createList();

        // For list transformations, we need to select the entire cell content
        if ([LIST_TYPES.ol, LIST_TYPES.ul, PARAGRAPH_TYPE].includes(elementType)) {
          try {
            // Verify paths are valid before creating selection
            const cellStartPoint = Editor.start(editor, cellPath);
            const cellEndPoint = Editor.end(editor, cellPath);

            Transforms.select(editor, { anchor: cellStartPoint, focus: cellEndPoint });

            if (elementType === LIST_TYPES.ol || elementType === LIST_TYPES.ul) {
              // list type
              const listTypeKey = elementType === LIST_TYPES.ol ? 'ol' : 'ul';

              listHelper.toggleList(editor, listTypeKey, PARAGRAPH_TYPE);
            } else {
              // paragraph
              const currentListElement = cellNode.children.find(
                (child) => Element.isElement(child) && [LIST_TYPES.ol, LIST_TYPES.ul].includes(child.type),
              );

              if (currentListElement && Element.isElement(currentListElement)) {
                listHelper.toggleList(editor, currentListElement.type as ListRootTypeKey, PARAGRAPH_TYPE);
              }
            }
          } catch (error) {
            console.warn('Failed to transform to list:', error);
          }
        } else {
          // For non-list transformations, create a snapshot and handle each content node
          const contentNodes = [...cellNode.children];

          contentNodes.forEach((contentNode, contentIndex) => {
            if (Element.isElement(contentNode)) {
              const contentPath = [...cellPath, contentIndex];

              try {
                // Verify path exists before proceeding
                const nodeAtPath = Node.get(editor, contentPath);

                if (!nodeAtPath) return;

                // Get the start and end points of the content node safely
                const startPoint = Editor.start(editor, contentPath);
                const endPoint = Editor.end(editor, contentPath);

                Transforms.select(editor, { anchor: startPoint, focus: endPoint });

                toggleNodesType(editor, elementType, {
                  at: contentPath,
                  match: (node) => Element.isElement(node) && node.type !== 'table_cell',
                });
              } catch (selectionError) {
                console.warn('Failed to set selection for content transformation:', selectionError);

                // Skip this node if path is invalid
                return;
              }
            }
          });
        }

        // Restore previous selection
        try {
          if (previousSelection) {
            Transforms.select(editor, previousSelection);
          } else {
            Transforms.deselect(editor);
          }
        } catch {
          // If selection restoration fails, just deselect
          Transforms.deselect(editor);
        }
      });
    } catch (error) {
      console.warn('Failed to transform cell content:', error);
    }
  };

  // Functions to transform content types for entire row or column
  const transformRowContent = (elementType: string) => {
    if (tableSelectedOn?.region === 'row' && typeof tableSelectedOn.index === 'number') {
      try {
        // Find all cells in the selected row
        const tablePath = ReactEditor.findPath(editor, element).slice(0, -4); // Get table path
        const tableNode = Node.get(editor, tablePath);

        if (!Element.isElement(tableNode)) return;

        const tableMainElement = tableNode.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!Element.isElement(tableMainElement)) return;

        // Find the row based on the selected index
        let targetRowElement = null;
        let targetRowPath = null;

        // Check header first
        const headerElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (headerElement && Element.isElement(headerElement)) {
          const headerRows = headerElement.children.filter(
            (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
          );

          if (tableSelectedOn.index < headerRows.length) {
            targetRowElement = headerRows[tableSelectedOn.index];
            const headerPath = ReactEditor.findPath(editor, headerElement);

            targetRowPath = [...headerPath, tableSelectedOn.index];
          }
        }

        // If not found in header, check body
        if (!targetRowElement) {
          const bodyElement = tableMainElement.children.find(
            (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
          );

          if (bodyElement && Element.isElement(bodyElement)) {
            const headerRowCount =
              headerElement && Element.isElement(headerElement)
                ? headerElement.children.filter(
                    (child) => Element.isElement(child) && child.type.includes(TABLE_ROW_TYPE),
                  ).length
                : 0;

            const bodyRowIndex = tableSelectedOn.index - headerRowCount;

            if (bodyRowIndex >= 0 && bodyRowIndex < bodyElement.children.length) {
              targetRowElement = bodyElement.children[bodyRowIndex];
              const bodyPath = ReactEditor.findPath(editor, bodyElement);

              targetRowPath = [...bodyPath, bodyRowIndex];
            }
          }
        }

        if (targetRowElement && Element.isElement(targetRowElement) && targetRowPath) {
          // Transform all cells in this row
          targetRowElement.children.forEach((cell, cellIndex) => {
            if (Element.isElement(cell)) {
              const cellPath = [...targetRowPath, cellIndex];
              // Transform content inside each cell

              transformCellContent(cellPath, elementType);
            }
          });
        }
      } catch (error) {
        console.warn('Failed to transform row content:', error);
      }
    }
  };

  const transformColumnContent = (elementType: string) => {
    if (tableSelectedOn?.region === 'column' && typeof tableSelectedOn.index === 'number') {
      try {
        // Find all cells in the selected column
        const tablePath = ReactEditor.findPath(editor, element).slice(0, -4); // Get table path
        const tableNode = Node.get(editor, tablePath);

        if (!Element.isElement(tableNode)) return;

        const tableMainElement = tableNode.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_MAIN_TYPE),
        );

        if (!Element.isElement(tableMainElement)) return;

        // Transform cells in header
        const headerElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        if (headerElement && Element.isElement(headerElement)) {
          headerElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const columnIndex = tableSelectedOn.index as number;
              const cell = row.children[columnIndex];

              if (Element.isElement(cell)) {
                const headerPath = ReactEditor.findPath(editor, headerElement);
                const cellPath = [...headerPath, rowIndex, columnIndex];

                transformCellContent(cellPath, elementType);
              }
            }
          });
        }

        // Transform cells in body
        const bodyElement = tableMainElement.children.find(
          (child) => Element.isElement(child) && child.type.includes(TABLE_BODY_TYPE),
        );

        if (bodyElement && Element.isElement(bodyElement)) {
          bodyElement.children.forEach((row, rowIndex) => {
            if (Element.isElement(row) && row.type.includes(TABLE_ROW_TYPE)) {
              const columnIndex = tableSelectedOn.index as number;
              const cell = row.children[columnIndex];

              if (Element.isElement(cell)) {
                const bodyPath = ReactEditor.findPath(editor, bodyElement);
                const cellPath = [...bodyPath, rowIndex, columnIndex];

                transformCellContent(cellPath, elementType);
              }
            }
          });
        }
      } catch (error) {
        console.warn('Failed to transform column content:', error);
      }
    }
  };

  const TagName = isHeader ? 'th' : 'td';

  const isSelectedInSameRow = tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex;
  const isSelectedInSameColumn =
    tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex;

  const isSelectionTriggerByMe =
    (isSelectedInSameRow && cellPosition.columnIndex === 0) || (isSelectedInSameColumn && cellPosition.rowIndex === 0);

  return (
    <TagName
      {...attributes}
      onMouseEnter={() => {
        setTableHoveredOn({ columnIndex: cellPosition.columnIndex, rowIndex: cellPosition.rowIndex });
      }}
      onMouseLeave={() => {
        setTableHoveredOn(undefined);
      }}
      className={clsx('qdr-table__cell', {
        'qdr-table__cell--header': isHeader || element.treatAsTitle,
        'qdr-table__cell--top-active': isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === 0),
        'qdr-table__cell--right-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === columnCount - 1),
        'qdr-table__cell--bottom-active':
          isSelectedInSameRow || (isSelectedInSameColumn && cellPosition.rowIndex === rowCount - 1),
        'qdr-table__cell--left-active':
          isSelectedInSameColumn || (isSelectedInSameRow && cellPosition.columnIndex === 0),
        'qdr-table__cell--is-selection-trigger-by-me': isSelectionTriggerByMe,
        'qdr-table__cell--focused': focused,
      })}
    >
      {children}
      <InlineToolbar
        className={'qdr-table__cell__focus-toolbar'}
        iconGroups={[
          {
            icons: [
              {
                icon: AddRowAtBottom,
                onClick: () => {
                  addRow({ position: 'bottom', rowIndex: cellPosition.rowIndex });
                },
              },
              {
                icon: AddRowAtTop,
                onClick: () => {
                  addRow({ position: 'top', rowIndex: cellPosition.rowIndex });
                },
              },
              {
                icon: AddColumnAtLeft,
                onClick: () => {
                  addColumn({
                    position: 'left',
                    columnIndex: cellPosition.columnIndex,
                    treatAsTitle: element.treatAsTitle,
                  });
                },
              },
              {
                icon: AddColumnAtRight,
                onClick: () => {
                  addColumn({
                    position: 'right',
                    columnIndex: cellPosition.columnIndex,
                    treatAsTitle: element.treatAsTitle,
                  });
                },
              },
            ],
          },
        ]}
      />
      {cellPosition.columnIndex === 0 && (
        <button
          type="button"
          contentEditable={false}
          onClick={() =>
            setTableSelectedOn((prev) => {
              if (prev?.region === 'row' && prev.index === cellPosition.rowIndex) {
                return undefined;
              }

              return { region: 'row', index: cellPosition.rowIndex };
            })
          }
          className={clsx('qdr-table__cell-row-action', {
            'qdr-table__cell-row-action--active':
              isSelectedInSameRow || (tableHoveredOn?.rowIndex === cellPosition.rowIndex && !tableSelectedOn),
          })}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      )}
      {cellPosition.rowIndex === 0 && (
        <button
          type="button"
          contentEditable={false}
          onClick={() =>
            setTableSelectedOn((prev) => {
              if (prev?.region === 'column' && prev.index === cellPosition.columnIndex) {
                return undefined;
              }

              return { region: 'column', index: cellPosition.columnIndex };
            })
          }
          className={clsx('qdr-table__cell-column-action', {
            'qdr-table__cell-column-action--active':
              isSelectedInSameColumn || (tableHoveredOn?.columnIndex === cellPosition.columnIndex && !tableSelectedOn),
          })}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      )}
      {cellPosition.columnIndex === 0 || cellPosition.rowIndex === 0 ? (
        <InlineToolbar
          className="qdr-table__cell__inline-table-toolbar"
          iconGroups={[
            {
              icons: (() => {
                if (tableSelectedOn?.region === 'row') {
                  return isHeader
                    ? [
                        {
                          icon: TableRemoveTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              moveRowToBody(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ]
                    : [
                        {
                          icon: TableSetColumnTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              moveRowToHeader(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ];
                }

                if (tableSelectedOn?.region === 'column') {
                  return element.treatAsTitle
                    ? [
                        {
                          icon: TableRemoveTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              unsetColumnAsTitle(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ]
                    : [
                        {
                          icon: TableSetRowTitle,
                          onClick: () => {
                            if (typeof tableSelectedOn.index === 'number') {
                              setColumnAsTitle(tableSelectedOn.index);
                              setTableSelectedOn(undefined);
                            }
                          },
                        },
                      ];
                }

                return [];
              })(),
            },
            {
              icons: [
                <ToolbarGroupIcon key="typography-change" icon={Paragraph}>
                  <ToolbarIcon
                    icon={Paragraph}
                    onClick={() => {
                      if (tableSelectedOn?.region === 'row') {
                        transformRowContent(PARAGRAPH_TYPE);
                      } else if (tableSelectedOn?.region === 'column') {
                        transformColumnContent(PARAGRAPH_TYPE);
                      }

                      setTableSelectedOn(undefined);
                    }}
                  />
                  <ToolbarIcon
                    icon={UnorderedList}
                    onClick={() => {
                      if (tableSelectedOn?.region === 'row') {
                        transformRowContent(LIST_TYPES.ul);
                      } else if (tableSelectedOn?.region === 'column') {
                        transformColumnContent(LIST_TYPES.ul);
                      }

                      setTableSelectedOn(undefined);
                    }}
                  />
                  <ToolbarIcon
                    icon={OrderedList}
                    onClick={() => {
                      if (tableSelectedOn?.region === 'row') {
                        transformRowContent(LIST_TYPES.ol);
                      } else if (tableSelectedOn?.region === 'column') {
                        transformColumnContent(LIST_TYPES.ol);
                      }

                      setTableSelectedOn(undefined);
                    }}
                  />
                </ToolbarGroupIcon>,
              ],
            },
            {
              icons: (() => {
                if (tableSelectedOn?.region === 'row') {
                  const addRowAtBottomAction = {
                    icon: AddRowAtBottom,
                    onClick: () => {
                      if (typeof tableSelectedOn.index === 'number') {
                        addRow({ position: 'bottom', rowIndex: tableSelectedOn.index });
                        setTableSelectedOn(undefined);
                      }
                    },
                  };

                  const addRowAtTopAction = {
                    icon: AddRowAtTop,
                    onClick: () => {
                      if (typeof tableSelectedOn.index === 'number') {
                        addRow({ position: 'top', rowIndex: tableSelectedOn.index });
                        setTableSelectedOn(undefined);
                      }
                    },
                  };

                  return [addRowAtBottomAction, addRowAtTopAction];
                }

                if (tableSelectedOn?.region === 'column') {
                  const addColumnAtLeftAction = {
                    icon: AddColumnAtLeft,
                    onClick: () => {
                      if (typeof tableSelectedOn.index === 'number') {
                        addColumn({
                          position: 'left',
                          columnIndex: tableSelectedOn.index,
                          treatAsTitle: element.treatAsTitle,
                        });

                        setTableSelectedOn(undefined);
                      }
                    },
                  };

                  const addColumnAtRightAction = {
                    icon: AddColumnAtRight,
                    onClick: () => {
                      if (typeof tableSelectedOn.index === 'number') {
                        addColumn({
                          position: 'right',
                          columnIndex: tableSelectedOn.index,
                          treatAsTitle: element.treatAsTitle,
                        });

                        setTableSelectedOn(undefined);
                      }
                    },
                  };

                  return [addColumnAtLeftAction, addColumnAtRightAction];
                }

                return [];
              })(),
            },
            {
              icons: [
                {
                  icon: Trash,
                  className: 'qdr-table__delete',
                  onClick: () => {
                    // Determine whether to delete row or column based on current selection
                    if (tableSelectedOn?.region === 'row' && typeof tableSelectedOn.index === 'number') {
                      deleteRow(tableSelectedOn.index);
                      setTableSelectedOn(undefined); // Clear selection after deletion
                    } else if (tableSelectedOn?.region === 'column' && typeof tableSelectedOn.index === 'number') {
                      deleteColumn(tableSelectedOn.index);
                      setTableSelectedOn(undefined); // Clear selection after deletion
                    }
                  },
                },
              ],
            },
          ]}
        />
      ) : null}
    </TagName>
  );
}

export default TableCell;
