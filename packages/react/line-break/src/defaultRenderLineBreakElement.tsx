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
    style={{ color: 'black', userSelect: 'none' }}
  >
    {/* {'<'} */}
    <Icon icon={CombinedShape} />
  </span>
);
