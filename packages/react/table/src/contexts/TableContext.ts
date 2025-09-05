import { createContext } from 'react';
import { TableContextType } from '../typings';

export const TableContext = createContext<TableContextType | null>(null);
