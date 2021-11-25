import { LINE_BREAK_TYPE } from '@quadrats/common/line-break';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { defaultRenderLineBreakElement } from './defaultRenderLineBreakElement';
import { JsxSerializeLineBreakElementProps } from './typings';

export type CreateJsxSerializeLineBreakOptions = Partial<
CreateJsxSerializeElementOptions<JsxSerializeLineBreakElementProps>
>;

export function createJsxSerializeLineBreak(options: CreateJsxSerializeLineBreakOptions = {}) {
  const { type = LINE_BREAK_TYPE, render = defaultRenderLineBreakElement } = options;
  return createJsxSerializeElement<JsxSerializeLineBreakElementProps>({ type, render });
}
