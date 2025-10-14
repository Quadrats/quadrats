import React, { useMemo } from 'react';
import { Editor, Path } from '@quadrats/core';
import { ReactEditor, useQuadrats, useLocale, useComposition } from '@quadrats/react';
import { RenderElementProps } from '@quadrats/react';

function AccordionTitle(props: {
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
  const locale = useLocale();
  const placeholder = locale.editor.accordion.titlePlaceholder;
  const composing = useMemo(() => Path.equals(compositionPath, path), [compositionPath, path]);

  return (
    <p {...attributes} className="qdr-accordion__title">
      {children}
      {isEmpty && !composing && (
        <span className="qdr-accordion__title__placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
    </p>
  );
}

export default AccordionTitle;
