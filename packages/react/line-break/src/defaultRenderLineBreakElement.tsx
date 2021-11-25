import React from 'react';
import { LineBreakElement } from '@quadrats/common/line-break';
import { RenderElementProps } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { CombinedShape } from 'icons/src/combined-shape';

export const defaultRenderLineBreakElement = ({
  attributes,
}: {
  attributes?: RenderElementProps['attributes'];
  element: LineBreakElement;
}) => (
  <span
    {...attributes}
    contentEditable={false}
    style={{ userSelect: 'none', verticalAlign: 'middle' }}
  >
    <Icon
      style={{ width: '24px', height: '24px', paddingTop: '6px' }}
      icon={CombinedShape}
      color="#C1C1C1"
    />
  </span>
);
