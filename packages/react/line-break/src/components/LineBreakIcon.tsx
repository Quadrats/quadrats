import React from 'react';
import { LineBreakEnter } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { ReactLineBreakIconElementProps } from '../typings';

function LineBreakIcon({
  attributes,
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
          paddingTop: '1px',
        }}
        icon={LineBreakEnter}
        color="#C1C1C1"
      />
    </span>
  );
}

export default LineBreakIcon;
