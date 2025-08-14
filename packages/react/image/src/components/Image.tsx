import React from 'react';
import { Transforms, Element, Editor, QuadratsElement } from '@quadrats/core';
import { ImageFigureElement } from '@quadrats/common/image';
import { AlignLeft, AlignCenter, AlignRight, Trash } from '@quadrats/icons';
import { ReactEditor, useSlateStatic } from '@quadrats/react';
import { InlineToolbar } from '@quadrats/react/toolbar';
import { RenderImageElementProps } from '../typings';
// import { useImageResizer } from '../hooks/useImageResizer';

function Image(props: RenderImageElementProps) {
  const {
    attributes,
    children,
    element,
    // resizeImage,
    src,
  } = props;

  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const parentEntry = Editor.above(editor, {
    at: path,
    match: (node) => Element.isElement(node) && (node as QuadratsElement).type === element.figureType,
    mode: 'lowest',
  });

  const parentNode = parentEntry?.[0] as ImageFigureElement;
  const parentPath = parentEntry?.[1];
  // const { focusedAndSelected, imageRef, onResizeStart } = useImageResizer(element, resizeImage);

  return (
    <div
      {...attributes}
      className="qdr-image qdr-image--with-inline-toolbar"
      onClick={() => Transforms.select(editor, ReactEditor.findPath(editor, element))}
      onMouseDown={(event) => event.preventDefault()}
      role="img"
    >
      <div className="qdr-image__spacer">{children}</div>
      <div contentEditable={false} style={{ position: 'relative' }}>
        <InlineToolbar
          className="qdr-image__inline-toolbar"
          leftIcons={[
            {
              icon: AlignLeft,
              onClick: () => {
                Transforms.setNodes(editor, { align: 'start' } as ImageFigureElement, { at: parentPath });
              },
              active: parentNode.align === 'start' || !parentNode.align,
            },
            {
              icon: AlignCenter,
              onClick: () => {
                Transforms.setNodes(editor, { align: 'center' } as ImageFigureElement, { at: parentPath });
              },
              active: parentNode.align === 'center',
            },
            {
              icon: AlignRight,
              onClick: () => {
                Transforms.setNodes(editor, { align: 'end' } as ImageFigureElement, { at: parentPath });
              },
              active: parentNode.align === 'end',
            },
          ]}
          rightIcons={[
            {
              icon: Trash,
              onClick: () => {
                Transforms.removeNodes(editor, { at: parentPath });
              },
            },
          ]}
        />
        {/* {focusedAndSelected && (
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
        )} */}
        <img
          // ref={imageRef}
          src={src}
          alt={src}
        />
      </div>
    </div>
  );
}

export default Image;
