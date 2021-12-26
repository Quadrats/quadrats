import { Link, LinkElement } from '@quadrats/common/link';
import { RenderElementProps, ReactWithable, WithCreateRenderElement, ReactEditor } from '@quadrats/react';

export type RenderLinkElementProps = RenderElementProps<LinkElement>;

export interface ReactLinkCreateRenderElementOptions {
  render?: (props: RenderLinkElementProps) => JSX.Element | null | undefined;
}

export interface ReactLink
  extends Omit<Link<ReactEditor>, 'with'>,
  WithCreateRenderElement<[ReactLinkCreateRenderElementOptions?]>,
  ReactWithable {}
