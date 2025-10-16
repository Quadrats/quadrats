import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { useTableDragContext } from '../contexts/TableDragContext';

interface RowDragButtonProps {
  rowIndex: number;
  headerRowCount: number;
  style?: React.CSSProperties;
  onClick: (e: React.MouseEvent) => void;
}

export const ROW_DRAG_TYPE = 'TABLE_ROW';

export const RowDragButton: React.FC<RowDragButtonProps> = ({ rowIndex, headerRowCount, style, onClick }) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setDragState, setDropTargetIndex, setDragDirection } = useTableDragContext();

  // 判斷當前 row 是否在 header 中
  const isInHeader = rowIndex < headerRowCount;

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ROW_DRAG_TYPE,
      item: () => {
        const dragItem = { rowIndex, isInHeader };

        // 設置拖曳狀態
        setDragState({ type: 'row', rowIndex, isInHeader });

        return dragItem;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        // 清除拖曳狀態
        setDragState(null);
        setDropTargetIndex(null);
        setDragDirection(null);
      },
    }),
    [rowIndex, isInHeader, setDragState, setDropTargetIndex, setDragDirection],
  );

  // 組合 ref
  drag(buttonRef);

  return (
    <button
      ref={buttonRef}
      type="button"
      contentEditable={false}
      style={style}
      onClick={onClick}
      className={clsx('qdr-table__cell-row-action', {
        'qdr-table__cell-row-action--dragging': isDragging,
      })}
    >
      <Icon icon={Drag} width={20} height={20} />
    </button>
  );
};
