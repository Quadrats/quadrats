import React from 'react';
import { CombinedShape } from '@quadrats/icons';
import { Icon } from '@quadrats/react/components';
import { RenderLineBreakElementProps } from '../typings';

function LineBreakIcon({
  attributes,
}: RenderLineBreakElementProps) {
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
        icon={CombinedShape}
        color="#C1C1C1"
      />
    </span>
  );
}

export default LineBreakIcon;
