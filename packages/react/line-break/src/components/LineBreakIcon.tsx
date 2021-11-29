import React, { useRef, useEffect, useMemo } from 'react';
import { LineBreakEnter, LineBreakShiftEnter } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { ReactLineBreakIconElementProps } from '../typings';

function LineBreakIcon({
  attributes,
  element,
}: ReactLineBreakIconElementProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const icon = useMemo(() => {
    if (element.text === 'shift-enter') return LineBreakShiftEnter;

    return LineBreakEnter;
  }, [element.text]);

  useEffect(() => {
    if (element.text !== 'shift-enter') return;

    const paragraphElement = ref.current?.parentElement;

    if (paragraphElement) {
      paragraphElement.setAttribute(
        'style',
        'margin-inline: 0; margin-block: 0;',
      );
    }
  }, [element.text]);

  return (
    <span
      {...attributes}
      ref={ref}
      contentEditable={false}
      style={{
        marginBlock: 0,
        marginInline: 0,
        userSelect: 'none',
      }}
    >
      <Icon
        style={{
          width: '24px',
          height: '24px',
          verticalAlign: 'middle',
        }}
        icon={icon}
        color="#C1C1C1"
      />
      <br />
    </span>
  );
}

export default LineBreakIcon;
