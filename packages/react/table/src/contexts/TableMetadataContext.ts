import { createContext } from 'react';
import { TableContextType } from '../typings';

export type TableMetadataContextType = Pick<
  TableContextType,
  | 'tableElement'
  | 'columnCount'
  | 'rowCount'
  | 'portalContainerRef'
  | 'isReachMaximumColumns'
  | 'isReachMaximumRows'
  | 'isReachMinimumNormalColumns'
  | 'isReachMinimumBodyRows'
  | 'pinnedColumns'
  | 'pinnedRows'
  | 'cellPositions'
  | 'isColumnPinned'
  | 'isRowPinned'
>;

export const TableMetadataContext = createContext<TableMetadataContextType | undefined>(undefined);
