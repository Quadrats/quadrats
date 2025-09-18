import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableMainJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return <table className="qdr-table__main">{children}</table>;
};
