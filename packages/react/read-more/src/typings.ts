import { ReadMore, ReadMoreElement } from '@quadrats/common/read-more';
import { WithCreateRenderElement, RenderElementProps, ReactEditor } from '@quadrats/react';

export type RenderReadMoreElementProps = RenderElementProps<ReadMoreElement>;

export interface ReactReadMoreCreateRenderElementOptions {
  render?: (props: RenderReadMoreElementProps) => JSX.Element | null | undefined;
}

export interface ReactReadMore extends ReadMore<ReactEditor>
  , WithCreateRenderElement<[ReactReadMoreCreateRenderElementOptions?]> {}
