import { useContext } from 'react';
import { TableContext } from '../contexts/TableContext';

export function useTable() {
  const context = useContext(TableContext);

  if (!context) {
    throw new Error('useTable must be used within a TableContext.Provider');
  }

  return context;
}
