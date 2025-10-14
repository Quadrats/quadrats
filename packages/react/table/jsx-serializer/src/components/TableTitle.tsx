import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableTitleJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return <span className="qdr-table__title">{children}</span>;
};
