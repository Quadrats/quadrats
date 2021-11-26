import { LineBreak, LineBreakElement } from '@quadrats/common/line-break';
import { WithCreateHandlers, WithCreateRenderElement, RenderElementProps } from '@quadrats/react';

export type RenderLineBreakElementProps = RenderElementProps<LineBreakElement>;

export interface ReactLineBreakIconElementProps {
  attributes?: RenderElementProps['attributes'];
  element: LineBreakElement;
}

export interface ReactLineBreakCreateHandlersOptions {
  /**
   * The hotkey to toggle line-break w/ specific level.
   */
  hotkey?: string;
}

export interface ReactLineBreakCreateRenderElementOptions {
  render?: (props: RenderLineBreakElementProps) => JSX.Element | null | undefined;
}

export interface ReactLineBreak
  extends LineBreak,
  WithCreateHandlers<[ReactLineBreakCreateHandlersOptions?]>,
  WithCreateRenderElement<[ReactLineBreakCreateRenderElementOptions?]> {}
