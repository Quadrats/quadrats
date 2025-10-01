import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { QuadratsElement } from '@quadrats/core';

export const TableHeaderJsxSerializeElement = ({ children, element }: JsxSerializeElementProps) => {
  const hasAnyRowPinned = element.children.some((child) =>
    (child as QuadratsElement).children.every((cell) => (cell as QuadratsElement & { pinned: boolean }).pinned),
  );

  return (
    <TableHeaderContext.Provider value={true}>
      <thead className={`qdr-table__header ${hasAnyRowPinned ? 'qdr-table__header--pinned' : ''}`}>{children}</thead>
    </TableHeaderContext.Provider>
  );
};
