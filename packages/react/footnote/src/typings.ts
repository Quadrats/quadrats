import { Footnote, FootnoteElement } from '@quadrats/common/footnote';
import { RenderElementProps, ReactWithable, WithCreateRenderElement } from '@quadrats/react';

export type RenderFootnoteElementProps = RenderElementProps<FootnoteElement>;

export interface ReactFootnoteCreateRenderElementOptions {
  render?: (props: RenderFootnoteElementProps) => JSX.Element | null | undefined;
}

export interface ReactFootnote
  extends Omit<Footnote, 'with'>,
  WithCreateRenderElement<[ReactFootnoteCreateRenderElementOptions?]>,
  // WithCreateHandlers,
  ReactWithable {}
