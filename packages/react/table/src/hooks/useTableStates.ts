import { useState } from 'react';
import { TableContextType } from '../typings';

export function useTableStates() {
  const [tableSelectedOn, setTableSelectedOn] = useState<TableContextType['tableSelectedOn']>();
  const [tableHoveredOn, setTableHoveredOn] = useState<TableContextType['tableHoveredOn']>();

  return {
    tableSelectedOn,
    setTableSelectedOn,
    tableHoveredOn,
    setTableHoveredOn,
  };
}
