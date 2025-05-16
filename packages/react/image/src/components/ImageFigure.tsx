import React from 'react';
import clsx from 'clsx';
import { Transforms } from '@quadrats/core';
import { ImageFigureElement } from '@quadrats/common/image';
import { AlignLeft, AlignCenter, AlignRight, Trash } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { ReactEditor, useSlateStatic, useFocused, useSelected } from '@quadrats/react';
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
      <div className="qdr-image__controller">
        <div className="qdr-image__controller__wrapper">
          <Icon
            className="qdr-image__controller__icon"
            icon={AlignLeft}
            width={24}
            height={24}
            onClick={() => {
              Transforms.setNodes(editor, { align: 'start' } as ImageFigureElement, { at: path });
            }}
          />
          <Icon
            className="qdr-image__controller__icon"
            icon={AlignCenter}
            width={24}
            height={24}
            onClick={() => {
              Transforms.setNodes(editor, { align: 'center' } as ImageFigureElement, { at: path });
            }}
          />
          <Icon
            className="qdr-image__controller__icon"
            icon={AlignRight}
            width={24}
            height={24}
            onClick={() => {
              Transforms.setNodes(editor, { align: 'end' } as ImageFigureElement, { at: path });
            }}
          />
        </div>
        <div className="qdr-image__controller__divider" />
        <Icon
          className="qdr-image__controller__icon"
          icon={Trash}
          width={24}
          height={24}
          onClick={() => {
            Transforms.removeNodes(editor, { at: path });
          }}
        />
      </div>
      {children}
    </figure>
  );
}

export default ImageFigure;
