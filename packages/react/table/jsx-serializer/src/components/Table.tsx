import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return <div className="qdr-table">{children}</div>;
};
