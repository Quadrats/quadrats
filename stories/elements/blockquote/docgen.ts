import { BlockquoteElement } from '@quadrats/common/blockquote';
import {
  ReactBlockquote,
  ReactBlockquoteCreateHandlersOptions,
  ReactBlockquoteCreateRenderElementOptions,
  RenderBlockquoteElementProps,
} from '@quadrats/react/blockquote';
import { JsxSerializeBlockquoteElementProps } from '@quadrats/react/blockquote/jsx-serializer';

export const createHandlersDocgen = (options: ReactBlockquoteCreateHandlersOptions) => options;
export const createRenderElementDocgen = (options: ReactBlockquoteCreateRenderElementOptions) => options;
export const ReactBlockquoteDocgen = (t: ReactBlockquote) => t;
export const BlockquoteElementDocgen = (element: BlockquoteElement) => element;
export const RenderBlockquoteElementPropsDocgen = (props: RenderBlockquoteElementProps) => props;
export const JsxSerializeBlockquoteElementPropsDocgen = (props: JsxSerializeBlockquoteElementProps) => props;
