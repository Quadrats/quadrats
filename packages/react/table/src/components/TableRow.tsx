import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableElement } from '@quadrats/common/table';

function TableRow(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  return <tr {...attributes}>{children}</tr>;
}

export default TableRow;
