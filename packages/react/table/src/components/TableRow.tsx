import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableRow(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  return <tr {...attributes}>{children}</tr>;
}

export default TableRow;
