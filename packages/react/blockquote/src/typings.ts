import { BlockquoteElement, Blockquote } from '@quadrats/common/blockquote';
import { WithCreateHandlers, WithCreateRenderElement, RenderElementProps } from '@quadrats/react';

export type RenderBlockquoteElementProps = RenderElementProps<BlockquoteElement>;

export interface ReactBlockquoteCreateHandlersOptions {
  /**
   * The hotkey to toggle blockquote.
   */
  hotkey?: string;
}

export interface ReactBlockquoteCreateRenderElementOptions {
  render?: (props: RenderBlockquoteElementProps) => JSX.Element | null | undefined;
}

export interface ReactBlockquote
  extends Blockquote,
  WithCreateHandlers<[ReactBlockquoteCreateHandlersOptions?]>,
  WithCreateRenderElement<[ReactBlockquoteCreateRenderElementOptions?]> {}
