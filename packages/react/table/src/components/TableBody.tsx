import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableElement } from '@quadrats/common/table';

function TableBody(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  return (
    <tbody {...attributes} className="qdr-table__body">
      {children}
    </tbody>
  );
}

export default TableBody;
