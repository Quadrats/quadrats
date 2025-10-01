import { useContext } from 'react';
import { TableMetadataContext } from '../contexts/TableMetadataContext';

export function useTableMetadata() {
  const context = useContext(TableMetadataContext);

  if (!context) {
    throw new Error('useTableMetadata must be used within a TableMetadataContext.Provider');
  }

  return context;
}
