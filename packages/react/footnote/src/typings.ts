import { Footnote, FootnoteElement } from '@quadrats/common/footnote';
import { RenderElementProps, ReactWithable, WithCreateRenderElement, ReactEditor } from '@quadrats/react';

export type RenderFootnoteElementProps = RenderElementProps<FootnoteElement>;

export interface ReactFootnoteCreateRenderElementOptions {
  render?: (props: RenderFootnoteElementProps) => JSX.Element | null | undefined;
}

export interface ReactFootnote
  extends Omit<Footnote<ReactEditor>, 'with'>,
  WithCreateRenderElement<[ReactFootnoteCreateRenderElementOptions?]>,
  ReactWithable {}
