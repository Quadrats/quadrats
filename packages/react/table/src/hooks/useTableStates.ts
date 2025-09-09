import { useState } from 'react';

export function useTableStates() {
  const [tableSelectedOn, setTableSelectedOn] = useState<'table' | 'header' | 'row' | 'column'>();

  return {
    tableSelectedOn,
    setTableSelectedOn,
  };
}
