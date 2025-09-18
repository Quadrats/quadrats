import React, { useContext } from 'react';
import clsx from 'clsx';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { JsxSerializeTableElementProps } from '../typings';

export const TableCellJsxSerializeElement = ({ children, element }: JsxSerializeTableElementProps) => {
  const isHeader = useContext(TableHeaderContext);

  const CellTag = isHeader ? 'th' : 'td';

  return (
    <CellTag className={clsx('qdr-table__cell', { 'qdr-table__cell--header': isHeader || element.treatAsTitle })}>
      {children}
    </CellTag>
  );
};
