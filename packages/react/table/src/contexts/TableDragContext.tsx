import React, { createContext, Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';

interface RowDragState {
  type: 'row';
  rowIndex: number;
  isInHeader: boolean;
}

interface ColumnDragState {
  type: 'column';
  columnIndex: number;
  isTitle: boolean;
}

type DragState = RowDragState | ColumnDragState | null;

type DragDirection = 'up' | 'down' | 'left' | 'right' | null;

interface TableDragContextValue {
  dragState: DragState;
  setDragState: Dispatch<SetStateAction<DragState>>;
  dropTargetIndex: number | null;
  setDropTargetIndex: Dispatch<SetStateAction<number | null>>;
  dragDirection: DragDirection;
  setDragDirection: Dispatch<SetStateAction<DragDirection>>;
}

const TableDragContext = createContext<TableDragContextValue | null>(null);

export const TableDragProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [dragState, setDragState] = useState<DragState>(null);
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null);
  const [dragDirection, setDragDirection] = useState<DragDirection>(null);

  const value = useMemo(
    () => ({
      dragState,
      setDragState,
      dropTargetIndex,
      setDropTargetIndex,
      dragDirection,
      setDragDirection,
    }),
    [dragState, dropTargetIndex, dragDirection],
  );

  return <TableDragContext.Provider value={value}>{children}</TableDragContext.Provider>;
};

export const useTableDragContext = () => {
  const context = useContext(TableDragContext);

  if (!context) {
    throw new Error('useTableDragContext must be used within TableDragProvider');
  }

  return context;
};
