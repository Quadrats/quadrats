import { createContext } from 'react';
import { TableScrollContextType } from '../typings';

export const TableScrollContext = createContext<TableScrollContextType>({
  scrollTop: 0,
});
