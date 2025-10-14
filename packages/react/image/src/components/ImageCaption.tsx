import React, { useMemo } from 'react';
import clsx from 'clsx';
import { Editor, Path } from '@quadrats/core';
import { ReactEditor, useSlateStatic, useLocale, useComposition } from '@quadrats/react';
import { RenderImageCaptionElementProps } from '../typings';

function ImageCaption(props: RenderImageCaptionElementProps) {
  const { compositionPath } = useComposition();
  const { attributes, children, element } = props;
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);
  const text = Editor.string(editor, path);
  const isEmpty = !text;
  const locale = useLocale();
  const placeholder = locale.editor.image.captionInputPlaceholder;
  const composing = useMemo(() => Path.equals(compositionPath, path), [compositionPath, path]);

  return (
    <figcaption
      {...attributes}
      className={clsx('qdr-image__caption', {
        'qdr-image__caption--empty': isEmpty,
      })}
    >
      {isEmpty && !composing && (
        <span className="qdr-image__caption-placeholder" contentEditable={false}>
          {placeholder}
        </span>
      )}
      {children}
    </figcaption>
  );
}

export default ImageCaption;
