import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableCell(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  const isHeader = false; // @TODO 判斷 header
  const TagName = isHeader ? 'th' : 'td';

  return (
    <TagName {...attributes} className={`qdr-table__cell ${isHeader ? 'qdr-table__cell--header' : ''}`}>
      {children}
    </TagName>
  );
}

export default TableCell;
