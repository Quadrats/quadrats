import { createContext } from 'react';
import { TableScrollContextType } from '../typings';

export const TableScrollContext = createContext<TableScrollContextType>({
  scrollRef: { current: null },
  scrollTop: 0,
  scrollLeft: 0,
});
