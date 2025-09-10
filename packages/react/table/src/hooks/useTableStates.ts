import { useState } from 'react';
import { TableContextType } from '../typings';

export function useTableStates() {
  const [tableSelectedOn, setTableSelectedOn] = useState<TableContextType['tableSelectedOn']>();

  return {
    tableSelectedOn,
    setTableSelectedOn,
  };
}
