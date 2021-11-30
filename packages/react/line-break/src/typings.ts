import { IsNodeMatchOptions, LineBreak, LineBreakElement } from '@quadrats/core';
import { WithCreateRenderElement, RenderElementProps, WithCreateHandlers } from '@quadrats/react';

export interface ExitBreakRule {
  hotkey: string;
  /**
   * @default ParagraphType
   */
  defaultType?: string;
  match?: IsNodeMatchOptions & {
    /**
     * Only match at if selection on edge of block.
     * @default false
     */
    onlyAtEdge?: boolean;
  };
  /**
   * Exit before the selected block if true.
   * @default false
   */
  before?: boolean;
}

export interface SoftBreakRule {
  hotkey: string;
  match?: IsNodeMatchOptions;
}

export type RenderLineBreakElementProps = RenderElementProps<LineBreakElement>;

export interface ReactLineBreakCreateRenderElementOptions {
  render?: (props: RenderLineBreakElementProps) => JSX.Element | null | undefined;
}

export interface ReactBreak extends LineBreak,
  WithCreateHandlers,
  WithCreateRenderElement<[ReactLineBreakCreateRenderElementOptions?]> { }
