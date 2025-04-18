import { JSX } from 'react';
import { Link, LinkElement } from '@quadrats/common/link';
import { RenderElementProps, ReactWithable, WithCreateRenderElement, Editor } from '@quadrats/react';

export type RenderLinkElementProps = RenderElementProps<LinkElement>;

export interface ReactLinkCreateRenderElementOptions {
  render?: (props: RenderLinkElementProps) => JSX.Element | null | undefined;
}

export interface ReactLink
  extends Omit<Link<Editor>, 'with'>,
  WithCreateRenderElement<[ReactLinkCreateRenderElementOptions?]>,
  ReactWithable {}
