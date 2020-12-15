import { LinkElement } from '@quadrats/common/link';
import {
  ReactLink,
  ReactLinkCreateRenderElementOptions,
  RenderLinkElementProps,
} from '@quadrats/react/link';
import { JsxSerializeLinkElementProps } from '@quadrats/react/link/jsx-serializer';

export const createRenderElementDocgen = (options?: ReactLinkCreateRenderElementOptions) => options;
export const ReactLinkDocgen = (t: ReactLink) => t;
export const LinkElementDocgen = (element: LinkElement) => element;
export const RenderLinkElementPropsDocgen = (props: RenderLinkElementProps) => props;
export const JsxSerializeLinkElementPropsDocgen = (props: JsxSerializeLinkElementProps) => props;
