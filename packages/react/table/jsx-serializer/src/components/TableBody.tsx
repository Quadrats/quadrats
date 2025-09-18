import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableBodyJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return <tbody className="qdr-table__body">{children}</tbody>;
};
