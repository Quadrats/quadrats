import React from 'react';
import { LineBreakEnter, LineBreakShiftEnter } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { ReactLineBreakIconElementProps } from '../typings';

function LineBreakIcon({
  attributes,
  element,
}: ReactLineBreakIconElementProps) {
  return (
    <span
      {...attributes}
      contentEditable={false}
      style={{
        userSelect: 'none',
        verticalAlign: 'middle',
      }}
    >
      <Icon
        style={{
          width: '24px',
          height: '24px',
          paddingTop: element.text === 'enter' ? '1px' : '6px',
        }}
        icon={element.text === 'enter' ? LineBreakEnter : LineBreakShiftEnter}
        color="#C1C1C1"
      />
    </span>
  );
}

export default LineBreakIcon;
