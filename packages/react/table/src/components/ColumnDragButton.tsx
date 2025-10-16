import React, { useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';
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
  const isTitle = checkIsTitleColumn(columnIndex);

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: COLUMN_DRAG_TYPE,
      item: () => {
        const dragItem = { columnIndex, isTitle };

        setDragState({ type: 'column', columnIndex, isTitle });

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
    [columnIndex, isTitle, setDragState, setDropTargetIndex, setDragDirection],
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
      title="點擊開啟選單，拖曳以移動"
      className={clsx('qdr-table__cell-column-action', {
        'qdr-table__cell-column-action--dragging': isDragging,
      })}
    >
      <Icon icon={Drag} width={20} height={20} />
    </button>
  );
};
