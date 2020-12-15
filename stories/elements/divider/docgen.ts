import { DividerElement } from '@quadrats/common/divider';
import {
  ReactDivider,
  ReactDividerCreateRenderElementOptions,
  RenderDividerElementProps,
} from '@quadrats/react/divider';
import { JsxSerializeDividerProps } from '@quadrats/react/divider/jsx-serializer';

export const createRenderElementDocgen = (options: ReactDividerCreateRenderElementOptions) => options;
export const ReactDividerDocgen = (t: ReactDivider) => t;
export const DividerElementDocgen = (element: DividerElement) => element;
export const RenderDividerElementPropsDocgen = (props: RenderDividerElementProps) => props;
export const JsxSerializeDividerPropsDocgen = (props: JsxSerializeDividerProps) => props;
