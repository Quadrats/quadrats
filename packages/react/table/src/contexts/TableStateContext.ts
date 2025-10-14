import { createContext } from 'react';
import { TableContextType } from '../typings';

export type TableStateContextType = Pick<
  TableContextType,
  'tableSelectedOn' | 'setTableSelectedOn' | 'tableHoveredOn' | 'setTableHoveredOn'
>;

export const TableStateContext = createContext<TableStateContextType | undefined>(undefined);
