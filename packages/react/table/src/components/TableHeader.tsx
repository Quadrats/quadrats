import React, { useMemo } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { TableHeaderContextType } from '../typings';

function TableHeader(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children } = props;

  const tableHeaderContextValue: TableHeaderContextType = useMemo(() => ({ isHeader: true }), []);

  return (
    <TableHeaderContext.Provider value={tableHeaderContextValue}>
      <thead {...attributes}>{children}</thead>
    </TableHeaderContext.Provider>
  );
}

export default TableHeader;
