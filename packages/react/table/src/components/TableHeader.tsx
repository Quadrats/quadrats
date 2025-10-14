import React, { useMemo } from 'react';
import clsx from 'clsx';
import { RenderElementProps } from '@quadrats/react';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { TableHeaderContextType } from '../typings';
import { TableElement } from '@quadrats/common/table';
import { QuadratsElement } from '@quadrats/core';

function TableHeader(props: RenderElementProps<TableElement>) {
  const { attributes, children, element } = props;

  const tableHeaderContextValue: TableHeaderContextType = useMemo(() => ({ isHeader: true }), []);
  const hasAnyRowPinned = element.children.some((child) =>
    (child as QuadratsElement).children.every((cell) => (cell as QuadratsElement & { pinned: boolean }).pinned),
  );

  return (
    <TableHeaderContext.Provider value={tableHeaderContextValue}>
      <thead {...attributes} className={clsx('qdr-table__header', { 'qdr-table__header--pinned': hasAnyRowPinned })}>
        {children}
      </thead>
    </TableHeaderContext.Provider>
  );
}

export default TableHeader;
