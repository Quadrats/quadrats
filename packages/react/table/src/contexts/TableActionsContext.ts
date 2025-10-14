import { createContext } from 'react';
import { TableContextType } from '../typings';

export type TableActionsContextType = Pick<
  TableContextType,
  | 'addColumn'
  | 'addRow'
  | 'addColumnAndRow'
  | 'deleteRow'
  | 'deleteColumn'
  | 'moveRowToBody'
  | 'moveRowToHeader'
  | 'unsetColumnAsTitle'
  | 'setColumnAsTitle'
  | 'pinColumn'
  | 'unpinColumn'
  | 'pinRow'
  | 'unpinRow'
  | 'swapRow'
  | 'swapColumn'
  | 'swapCell'
>;

export const TableActionsContext = createContext<TableActionsContextType | undefined>(undefined);
