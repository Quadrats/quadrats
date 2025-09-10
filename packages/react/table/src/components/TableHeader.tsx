import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function TableHeader(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  return (
    <thead {...attributes}>
      <tr className="qdr-table__header-row">{children}</tr>
    </thead>
  );
}

export default TableHeader;
