import { JSX } from 'react';
import { ReadMore, ReadMoreElement } from '@quadrats/common/read-more';
import { WithCreateRenderElement, RenderElementProps, Editor } from '@quadrats/react';

export type RenderReadMoreElementProps = RenderElementProps<ReadMoreElement>;

export interface ReactReadMoreCreateRenderElementOptions {
  render?: (props: RenderReadMoreElementProps) => JSX.Element | null | undefined;
}

export interface ReactReadMore extends ReadMore<Editor>
  , WithCreateRenderElement<[ReactReadMoreCreateRenderElementOptions?]> {}
