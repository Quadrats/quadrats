import { JSX } from 'react';
import { List, ListElement, ListTypeKey } from '@quadrats/common/list';
import { WithCreateHandlers, WithCreateRenderElement, RenderElementProps, Editor } from '@quadrats/react';

export type RenderListElementProps = RenderElementProps<ListElement>;

export type ReactListCreateRenderElementOptions = {
  [key in ListTypeKey]?: (props: RenderListElementProps) => JSX.Element | null | undefined;
};

export interface ReactList
  extends List<Editor>,
  WithCreateHandlers,
  WithCreateRenderElement<[ReactListCreateRenderElementOptions?]> {}
