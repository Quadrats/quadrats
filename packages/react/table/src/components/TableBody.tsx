import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableBody(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  return (
    <tbody {...attributes} className="qdr-table__body">
      {children}
    </tbody>
  );
}

export default TableBody;
