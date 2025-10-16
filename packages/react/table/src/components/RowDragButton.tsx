import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
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

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ROW_DRAG_TYPE,
      item: () => {
        const dragItem = { rowIndex, isInHeader };

        setDragState({ type: 'row', rowIndex, isInHeader });

        return dragItem;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: () => {
        setDragState(null);
        setDropTargetIndex(null);
        setDragDirection(null);
      },
    }),
    [rowIndex, isInHeader, setDragState, setDropTargetIndex, setDragDirection],
  );

  // 使用空白圖片作為 drag preview，避免顯示預設的拖曳圖像
  useEffect(() => {
    preview(getEmptyImage(), { captureDraggingState: true });
  }, [preview]);

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
