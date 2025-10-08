import { useContext } from 'react';
import { TableStateContext } from '../contexts/TableStateContext';

export function useTableStateContext() {
  const context = useContext(TableStateContext);

  if (!context) {
    throw new Error('useTableState must be used within a TableStateContext.Provider');
  }

  return context;
}
