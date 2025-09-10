import React, { useContext, useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps, useSlateStatic } from '@quadrats/react';
import { Element, Node } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { Icon } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { TABLE_ROW_TYPE, TABLE_HEADER_TYPE, TABLE_MAIN_TYPE, TABLE_BODY_TYPE } from '@quadrats/common/table';
import { useTable } from '../hooks/useTable';

function TableCell(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children, element } = props;
  const { tableSelectedOn, setTableSelectedOn } = useTable();
  const { isHeader } = useContext(TableHeaderContext);
  const editor = useSlateStatic();

  const cellPosition = useMemo(() => {
    try {
      const cellPath = ReactEditor.findPath(editor, element);
      const rowPath = cellPath.slice(0, -1);
      const rowNode = Node.get(editor, rowPath);

      if (!Element.isElement(rowNode)) {
        return { columnIndex: -1, rowIndex: -1 };
      }

      const columnIndex = cellPath[cellPath.length - 1];
      let rowIndex = -1;

      if (rowNode.type.includes(TABLE_HEADER_TYPE)) {
        // Header is always row 0 ?
        rowIndex = 0;
      } else if (rowNode.type.includes(TABLE_ROW_TYPE)) {
        const tableMainPath = rowPath.slice(0, -1);
        const tableMainNode = Node.get(editor, tableMainPath);

        if (!Element.isElement(tableMainNode) || !tableMainNode.type.includes(TABLE_MAIN_TYPE)) {
          return { columnIndex, rowIndex: -1 };
        }

        const hasHeader = tableMainNode.children.some(
          (child) => Element.isElement(child) && child.type.includes(TABLE_HEADER_TYPE),
        );

        const tableBodyPath = rowPath.slice(0, -1);
        const tableBodyNode = Node.get(editor, tableBodyPath);

        if (!Element.isElement(tableBodyNode) || !tableBodyNode.type.includes(TABLE_BODY_TYPE)) {
          return { columnIndex, rowIndex: -1 };
        }

        const rowIndexInBody = rowPath[rowPath.length - 1];

        // If there's a header, body rows start from index 1 ?
        rowIndex = hasHeader ? rowIndexInBody + 1 : rowIndexInBody;
      }

      return { columnIndex, rowIndex };
    } catch (error) {
      console.warn('Error calculating cell position:', error);

      return { columnIndex: -1, rowIndex: -1 };
    }
  }, [editor, element]);

  const TagName = isHeader ? 'th' : 'td';

  return (
    <TagName {...attributes} className={`qdr-table__cell ${isHeader ? 'qdr-table__cell--header' : ''}`}>
      {children}
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
              tableSelectedOn?.region === 'row' && tableSelectedOn?.index === cellPosition.rowIndex,
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
              tableSelectedOn?.region === 'column' && tableSelectedOn?.index === cellPosition.columnIndex,
          })}
        >
          <Icon icon={Drag} width={20} height={20} />
        </button>
      )}
    </TagName>
  );
}

export default TableCell;
