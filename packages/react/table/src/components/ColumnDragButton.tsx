import React, { useRef } from 'react';
import { useDrag } from 'react-dnd';
import clsx from 'clsx';
import { Icon } from '@quadrats/react/components';
import { Drag } from '@quadrats/icons';
import { useTableDragContext } from '../contexts/TableDragContext';

interface ColumnDragButtonProps {
  columnIndex: number;
  style?: React.CSSProperties;
  onClick: (e: React.MouseEvent) => void;
  checkIsTitleColumn: (columnIndex: number) => boolean;
}

export const COLUMN_DRAG_TYPE = 'TABLE_COLUMN';

export const ColumnDragButton: React.FC<ColumnDragButtonProps> = ({
  columnIndex,
  style,
  onClick,
  checkIsTitleColumn,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { setDragState, setDropTargetIndex, setDragDirection } = useTableDragContext();

  // 判斷當前 column 是否為標題列
  const isTitle = checkIsTitleColumn(columnIndex);

  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: COLUMN_DRAG_TYPE,
      item: () => {
        const dragItem = { columnIndex, isTitle };

        // 設置拖曳狀態
        setDragState({ type: 'column', columnIndex, isTitle });

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
    [columnIndex, isTitle, setDragState, setDropTargetIndex, setDragDirection],
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
      className={clsx('qdr-table__cell-column-action', {
        'qdr-table__cell-column-action--dragging': isDragging,
      })}
    >
      <Icon icon={Drag} width={20} height={20} />
    </button>
  );
};
