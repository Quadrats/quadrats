import React, { useMemo } from 'react';
import { RenderElementProps } from '@quadrats/react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { TableHeaderContextType } from '../typings';
import { TableElement } from '@quadrats/common/table';

function TableHeader(props: RenderElementProps<TableElement>) {
  const { attributes, children } = props;

  const tableHeaderContextValue: TableHeaderContextType = useMemo(() => ({ isHeader: true }), []);

  return (
    <TableHeaderContext.Provider value={tableHeaderContextValue}>
      <thead {...attributes} className="qdr-table__header">
        {children}
      </thead>
    </TableHeaderContext.Provider>
  );
}

export default TableHeader;
