import React, { useMemo, useRef } from 'react';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';
import { TableScrollContext } from '../contexts/TableScrollContext';
import { calculateTableMinWidth, ColumnWidth, columnWidthToCSS } from '@quadrats/common/table';

export const TableMainJsxSerializeElement = ({
  children,
  columnWidths,
}: JsxSerializeElementProps & { columnWidths?: ColumnWidth[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollContextValue = useMemo(() => ({ scrollRef }), [scrollRef]);
  const tableMinWidth = useMemo(() => (columnWidths ? calculateTableMinWidth(columnWidths) : '100%'), [columnWidths]);

  return (
    <div ref={scrollRef} className="qdr-table__scrollContainer">
      <TableScrollContext.Provider value={scrollContextValue}>
        <table
          className="qdr-table__main"
          style={{
            minWidth: tableMinWidth,
          }}
        >
          {columnWidths?.length ? (
            <colgroup>
              {columnWidths.map((width, index) => (
                <col key={index} style={{ width: columnWidthToCSS(width), minWidth: columnWidthToCSS(width) }} />
              ))}
            </colgroup>
          ) : null}
          {children}
        </table>
      </TableScrollContext.Provider>
    </div>
  );
};
