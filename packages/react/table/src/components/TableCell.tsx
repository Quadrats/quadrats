import React, { useContext } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableContext } from '../contexts/TableContext';

function TableCell(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children, element } = props;
  const tableContext = useContext(TableContext);

  // Get cell position from context
  const cellPosition = tableContext?.getCellPosition?.(element);
  const isHeader = cellPosition?.isHeader || false;

  const TagName = isHeader ? 'th' : 'td';

  return (
    <TagName
      {...attributes}
      className={`qdr-table__cell ${isHeader ? 'qdr-table__cell--header' : ''}`}
      data-row-index={cellPosition?.rowIndex}
      data-column-index={cellPosition?.columnIndex}
    >
      {children}
    </TagName>
  );
}

export default TableCell;
