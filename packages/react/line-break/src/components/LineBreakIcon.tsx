import React, { useRef, useEffect, useMemo } from 'react';
import { LineBreakEnter, LineBreakShiftEnter } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { ReactLineBreakIconElementProps } from '../typings';

function LineBreakIcon({
  attributes,
  element,
}: ReactLineBreakIconElementProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  const isShiftEnter = useMemo(() => (
    element.text === 'shift-enter'
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ), []);

  const icon = useMemo(() => {
    if (isShiftEnter) return LineBreakShiftEnter;

    return LineBreakEnter;
  }, [isShiftEnter]);

  useEffect(() => {
    const paragraphElement = ref.current?.parentElement;

    if (isShiftEnter && paragraphElement) {
      paragraphElement.setAttribute(
        'style',
        'margin-inline: 0; margin-block: 0;',
      );
    }

    if (!isShiftEnter && paragraphElement) {
      paragraphElement.removeAttribute('style');
    }
  }, [isShiftEnter]);

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
