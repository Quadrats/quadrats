import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableRow(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  const isHeader = false; // @TODO 判斷 header

  return (
    <tr {...attributes} className={`qdr-table__row ${isHeader ? 'qdr-table__row--header' : ''}`}>
      {children}
    </tr>
  );
}

export default TableRow;
