import { Divider, DividerElement } from '@quadrats/common/divider';
import { Editor } from '@quadrats/core';
import { WithCreateRenderElement, RenderElementProps } from '@quadrats/react';

export type RenderDividerElementProps = RenderElementProps<DividerElement>;

export interface ReactDividerCreateRenderElementOptions {
  render?: (props: RenderDividerElementProps) => JSX.Element | null | undefined;
}

export interface ReactDivider
  extends Divider<Editor>, WithCreateRenderElement<[ReactDividerCreateRenderElementOptions?]> {}
