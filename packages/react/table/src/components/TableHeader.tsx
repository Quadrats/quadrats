import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableHeader(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  return (
    <tr {...attributes} className="qdr-table__header-row">
      {children}
    </tr>
  );
}

export default TableHeader;
