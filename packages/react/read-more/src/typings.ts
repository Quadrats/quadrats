import { ReadMore, ReadMoreElement } from '@quadrats/common/read-more';
import { WithCreateRenderElement, RenderElementProps } from '@quadrats/react';

export type RenderReadMoreElementProps = RenderElementProps<ReadMoreElement>;

export interface ReactReadMoreCreateRenderElementOptions {
  render?: (props: RenderReadMoreElementProps) => JSX.Element | null | undefined;
}

export interface ReactReadMore extends ReadMore, WithCreateRenderElement<[ReactReadMoreCreateRenderElementOptions?]> {}
