import React from 'react';
import { Transforms } from '@quadrats/core';
import { ReactEditor, useEditor } from '@quadrats/react';
import { RenderImageElementProps } from '../typings';
import { useImageResizer } from '../hooks/useImageResizer';
import './image.scss';

function Image(props: RenderImageElementProps) {
  const {
    attributes,
    children,
    element, resizeImage, src,
  } = props;
  const editor = useEditor();
  const { focusedAndSelected, imageRef, onResizeStart } = useImageResizer(element, resizeImage);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions
    <div
      {...attributes}
      className="qdr-image"
      onClick={() => Transforms.select(editor, ReactEditor.findPath(editor, element))}
      onMouseDown={(event) => event.preventDefault()}
      role="img"
    >
      <div className="qdr-image__spacer">{children}</div>
      <div contentEditable={false}>
        {focusedAndSelected && (
          <>
            <span className="qdr-image__boundary" />
            <span
              aria-label="resize image"
              className="qdr-image__resizer"
              onMouseDown={onResizeStart}
              onTouchStart={onResizeStart}
              role="button"
              tabIndex={-1}
            />
          </>
        )}
        <img ref={imageRef} src={src} alt={src} />
      </div>
    </div>
  );
}

export default Image;
