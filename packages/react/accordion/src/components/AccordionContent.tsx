import React from 'react';
import { Editor } from '@quadrats/core';
import { ReactEditor, useQuadrats, useLocale } from '@quadrats/react';
import { RenderElementProps } from '@quadrats/react';
import { useAccordion } from '../hooks/useAccordion';

function AccordionContent(props: {
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
  const placeholder = locale.editor.accordion.contentPlaceholder;

  const { expanded } = useAccordion();

  if (!expanded) return null;

  return (
    <p
      {...attributes}
      className="qdr-accordion__content"
    >
      {isEmpty && (
        <span  className="qdr-accordion__content__placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
      {children}
    </p>
  );
}

export default AccordionContent;
