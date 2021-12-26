import { Divider, DividerElement } from '@quadrats/common/divider';
import { WithCreateRenderElement, RenderElementProps, ReactEditor } from '@quadrats/react';

export type RenderDividerElementProps = RenderElementProps<DividerElement>;

export interface ReactDividerCreateRenderElementOptions {
  render?: (props: RenderDividerElementProps) => JSX.Element | null | undefined;
}

export interface ReactDivider
  extends Divider<ReactEditor>, WithCreateRenderElement<[ReactDividerCreateRenderElementOptions?]> {}
