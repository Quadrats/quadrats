import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { TableHeaderContext } from '../contexts/TableHeaderContext';

export const TableHeaderJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return (
    <TableHeaderContext.Provider value={true}>
      <thead className="qdr-table__header">{children}</thead>
    </TableHeaderContext.Provider>
  );
};
