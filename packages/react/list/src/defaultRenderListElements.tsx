import React, { JSX } from 'react';
import { ListTypeKey } from '@quadrats/common/list';
import { RenderElementProps } from '@quadrats/react';

export const defaultRenderListElements: Record<
ListTypeKey,
(props: { attributes?: RenderElementProps['attributes']; children: any }) => JSX.Element
> = {
  ol: ({ attributes, children }) => <ol {...attributes} className="qdr-ol">{children}</ol>,
  ul: ({ attributes, children }) => <ul {...attributes} className="qdr-ul">{children}</ul>,
  li: ({ attributes, children }) => <li {...attributes} className="qdr-li">{children}</li>,
};
