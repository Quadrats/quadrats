import {
  ReactToggleMark,
  ReactToggleMarkCreateHandlersOptions,
  ReactToggleMarkCreateRenderLeafOptions,
  RenderToggleMarkProps,
} from '@quadrats/react/toggle-mark';
import { JsxSerializeToggleMarkProps } from '@quadrats/react/toggle-mark/jsx-serializer';

export const createHandlersDocgen = (options: ReactToggleMarkCreateHandlersOptions) => options;
export const createRenderLeafDocgen = (options: ReactToggleMarkCreateRenderLeafOptions) => options;
export const ReactToggleMarkDocgen = (t: ReactToggleMark) => t;
export const RenderToggleMarkPropsDocgen = (props: RenderToggleMarkProps) => props;
export const JsxSerializeToggleMarkPropsDocgen = (props: JsxSerializeToggleMarkProps) => props;
