import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableRowJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return <tr className="qdr-table__row">{children}</tr>;
};
