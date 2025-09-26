import React from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export const TableMainJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  return (
    <div className="qdr-table__scrollContainer">
      <table className="qdr-table__main">{children}</table>
    </div>
  );
};
