import React, { useContext, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { TableHeaderContext } from '../contexts/TableHeaderContext';
import { JsxSerializeTableElementProps } from '../typings';
import { TableScrollContext } from '../contexts/TableScrollContext';

export const TableCellJsxSerializeElement = ({
  children,
  element,
  isColumnPinned,
}: JsxSerializeTableElementProps & { isColumnPinned?: boolean }) => {
  const isHeader = useContext(TableHeaderContext);
  // calculate the left position of the cell when it is stuck
  const cellRef = useRef<HTMLTableCellElement>(null);
  const { scrollRef } = useContext(TableScrollContext);
  const [cellStuckAtLeft, setCellStuckAtLeft] = useState<number>(0);

  useEffect(() => {
    const { current: cell } = cellRef;
    const { current: scrollContainer } = scrollRef;

    if (scrollContainer && cell) {
      const cellRect = cell.getBoundingClientRect();
      const containerRect = scrollContainer.getBoundingClientRect();

      setCellStuckAtLeft(Math.max(Math.round(cellRect.left - containerRect.left), 0));
    }
  }, [scrollRef]);

  const CellTag = isHeader ? 'th' : 'td';
  const shouldPinned = element.pinned && isColumnPinned && element.treatAsTitle;

  return (
    <CellTag
      ref={cellRef}
      className={clsx('qdr-table__cell', {
        'qdr-table__cell--header': isHeader || element.treatAsTitle,
        'qdr-table__cell--pinned': shouldPinned,
      })}
      style={
        shouldPinned
          ? {
              left: cellStuckAtLeft,
            }
          : undefined
      }
    >
      {children}
    </CellTag>
  );
};
