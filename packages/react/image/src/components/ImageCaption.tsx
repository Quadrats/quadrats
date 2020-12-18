import React from 'react';
import clsx from 'clsx';
import { Editor } from '@quadrats/core';
import { ReactEditor, useEditor, useLocale } from '@quadrats/react';
import { RenderImageCaptionElementProps } from '../typings';
import './image.scss';

function ImageCaption(props: RenderImageCaptionElementProps) {
  const { attributes, children, element } = props;
  const editor = useEditor();
  const path = ReactEditor.findPath(editor, element);
  const text = Editor.string(editor, path);
  const isEmpty = !text;
  const locale = useLocale();
  const placeholder = locale.editor.image.captionInputPlaceholder;

  return (
    <figcaption
      {...attributes}
      className={clsx('qdr-image__caption', {
        'qdr-image__caption--empty': isEmpty,
      })}
    >
      {isEmpty && (
        <span className="qdr-image__caption-placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
      {children}
    </figcaption>
  );
}

export default ImageCaption;
