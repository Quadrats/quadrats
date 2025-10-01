import React, { useMemo, useRef } from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { TableScrollContext } from '../contexts/TableScrollContext';

export const TableMainJsxSerializeElement = ({ children }: JsxSerializeElementProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollContextValue = useMemo(() => ({ scrollRef }), [scrollRef]);

  return (
    <div ref={scrollRef} className="qdr-table__scrollContainer">
      <TableScrollContext.Provider value={scrollContextValue}>
        <table className="qdr-table__main">{children}</table>
      </TableScrollContext.Provider>
    </div>
  );
};
