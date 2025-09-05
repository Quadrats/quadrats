import React, { useContext } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableContext } from '../contexts/TableContext';

function TableRow(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children, element } = props;
  const tableContext = useContext(TableContext);

  // Get row position from context if available
  const rowPosition = tableContext?.getRowPosition?.(element);
  const isHeader = rowPosition?.isHeader || false;

  return (
    <tr
      {...attributes}
      className={`qdr-table__row ${isHeader ? 'qdr-table__row--header' : ''}`}
      data-row-index={rowPosition?.rowIndex}
    >
      {children}
    </tr>
  );
}

export default TableRow;
