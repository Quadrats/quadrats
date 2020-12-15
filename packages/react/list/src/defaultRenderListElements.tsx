import React from 'react';
import { ListTypeKey } from '@quadrats/common/list';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderListElements: Record<
ListTypeKey,
(props: { attributes?: RenderElementProps['attributes']; children: any }) => JSX.Element
> = {
  ol: ({ attributes, children }) => <ol {...attributes}>{children}</ol>,
  ul: ({ attributes, children }) => <ul {...attributes}>{children}</ul>,
  li: ({ attributes, children }) => <li {...attributes}>{children}</li>,
};
