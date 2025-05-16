import React from 'react';
import clsx from 'clsx';
import { Transforms } from '@quadrats/core';
import { ImageFigureElement } from '@quadrats/common/image';
import { AlignLeft, AlignCenter, AlignRight, Trash } from '@quadrats/icons';
import { ReactEditor, useSlateStatic, useFocused, useSelected } from '@quadrats/react';
import { InlineToolbar } from '../../../toolbar/src';
import { RenderImageFigureElementProps } from '../typings';

function ImageFigure(props: RenderImageFigureElementProps) {
  const { attributes, children, element, style } = props;

  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  const focused = useFocused();
  const selected = useSelected();
  const blurred = !focused || !selected;

  return (
    <figure
      {...attributes}
      className={clsx('qdr-image__figure', {
        'qdr-image__figure--blurred': blurred,
      })}
      style={style}
    >
      <InlineToolbar
        className="qdr-image__inline-toolbar"
        leftIcons={[
          {
            icon: AlignLeft,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'start' } as ImageFigureElement, { at: path });
            },
            active: element.align === 'start' || !element.align,
          },
          {
            icon: AlignCenter,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'center' } as ImageFigureElement, { at: path });
            },
            active: element.align === 'center',
          },
          {
            icon: AlignRight,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'end' } as ImageFigureElement, { at: path });
            },
            active: element.align === 'end',
          },
        ]}
        rightIcons={[
          {
            icon: Trash,
            onClick: () => {
              Transforms.removeNodes(editor, { at: path });
            },
          },
        ]}
      />
      {children}
    </figure>
  );
}

export default ImageFigure;
