import React from 'react';
import clsx from 'clsx';
import { useFocused, useSelected } from '@quadrats/react';
import { RenderImageFigureElementProps } from '../typings';
import './image.scss';

function ImageFigure(props: RenderImageFigureElementProps) {
  const { attributes, children, style } = props;
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
      {children}
    </figure>
  );
}

export default ImageFigure;
