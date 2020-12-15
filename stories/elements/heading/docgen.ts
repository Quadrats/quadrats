import {
  HeadingLevel,
  HeadingElement,
} from '@quadrats/common/heading';
import {
  ReactHeading,
  ReactHeadingCreateHandlersOptions,
  ReactHeadingCreateRenderElementOptions,
  RenderHeadingElementProps,
} from '@quadrats/react/heading';
import { JsxSerializeHeadingElementProps } from '@quadrats/react/heading/jsx-serializer';

export const createHandlersDocgen = (options: ReactHeadingCreateHandlersOptions) => options;
export const createRenderElementDocgen = (options: ReactHeadingCreateRenderElementOptions) => options;
export const ReactHeadingDocgen = (t: ReactHeading<HeadingLevel>) => t;
export const HeadingElementDocgen = (element: HeadingElement) => element;
export const RenderHeadingElementPropsDocgen = (props: RenderHeadingElementProps) => props;
export const JsxSerializeHeadingElementPropsDocgen = (props: JsxSerializeHeadingElementProps) => props;
