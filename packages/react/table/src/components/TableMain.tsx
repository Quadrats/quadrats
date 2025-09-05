import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableMain(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  // For now, we'll use a simple approach where all children go into tbody
  // The structure will be handled by the Slate element structure itself
  return (
    <table {...attributes} className="qdr-table__main">
      <tbody className="qdr-table__body">{children}</tbody>
    </table>
  );
}

export default TableMain;
