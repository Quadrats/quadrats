import React, { useMemo } from 'react';
import { Editor, Path } from '@quadrats/core';
import { ReactEditor, useQuadrats, useComposition } from '@quadrats/react';
import { RenderElementProps } from '@quadrats/react';

function TableTitle(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { compositionPath } = useComposition();
  const { attributes, children, element } = props;
  const editor = useQuadrats();
  const path = ReactEditor.findPath(editor, element);
  const text = Editor.string(editor, path);
  const isEmpty = !text;
  const composing = useMemo(() => Path.equals(compositionPath, path), [compositionPath, path]);

  return (
    <h3 {...attributes} className="qdr-table__title">
      {children}
      {isEmpty && !composing && (
        <span className="qdr-table__title__placeholder" contentEditable={false}>
          請輸入表格標題
        </span>
      )}
    </h3>
  );
}

export default TableTitle;
