import React, { useMemo, useContext } from 'react';
import { Editor, Path } from '@quadrats/core';
import { ReactEditor, useQuadrats, useComposition } from '@quadrats/react';
import { RenderElementProps } from '@quadrats/react';
import { TableContext } from '../contexts/TableContext';

function TableCell(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { compositionPath } = useComposition();
  const { attributes, children, element } = props;
  const editor = useQuadrats();
  const tableContext = useContext(TableContext);

  const path = ReactEditor.findPath(editor, element);
  const text = Editor.string(editor, path);
  const isEmpty = !text;

  // Get cell position from context
  const cellPosition = tableContext?.getCellPosition?.(element);
  const isHeader = cellPosition?.isHeader || false;
  const placeholder = isHeader ? 'Header...' : 'Cell content...';

  const composing = useMemo(() => Path.equals(compositionPath, path), [compositionPath, path]);

  const TagName = isHeader ? 'th' : 'td';

  return (
    <TagName
      {...attributes}
      className={`qdr-table__cell ${isHeader ? 'qdr-table__cell--header' : ''}`}
      data-row-index={cellPosition?.rowIndex}
      data-column-index={cellPosition?.columnIndex}
    >
      {children}
      {isEmpty && !composing && (
        <span className="qdr-table__cell__placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
    </TagName>
  );
}

export default TableCell;