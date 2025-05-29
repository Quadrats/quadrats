import React from 'react';
import { Editor } from '@quadrats/core';
import { ReactEditor, useQuadrats, useLocale } from '@quadrats/react';
import { RenderElementProps } from '@quadrats/react';

function AccordionTitle(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) {
  const { attributes, children, element } = props;
  const editor = useQuadrats();
  const path = ReactEditor.findPath(editor, element);
  const text = Editor.string(editor, path);
  const isEmpty = !text;
  const locale = useLocale();
  const placeholder = locale.editor.accordion.titlePlaceholder;

  return (
    <p
      {...attributes}
      className="qdr-accordion__title"
    >
      {isEmpty && (
        <span  className="qdr-accordion__title__placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
      {children}
    </p>
  );
}

export default AccordionTitle;
