import { createContext } from 'react';
import { TableHeaderContextType } from '../typings';

export const TableHeaderContext = createContext<TableHeaderContextType>({
  isHeader: false,
});
