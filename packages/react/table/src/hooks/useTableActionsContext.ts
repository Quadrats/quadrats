import { useContext } from 'react';
import { TableActionsContext } from '../contexts/TableActionsContext';

export function useTableActionsContext() {
  const context = useContext(TableActionsContext);

  if (!context) {
    throw new Error('useTableActionsContext must be used within a TableActionsContext.Provider');
  }

  return context;
}
