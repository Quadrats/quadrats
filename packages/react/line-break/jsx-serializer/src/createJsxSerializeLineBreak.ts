/* eslint-disable max-len */
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { JsxSerializeLineBreakElementProps } from './typings';
import { defaultRenderLineBreakElement } from './defaultRenderLineBreakElement';
import { LINE_BREAK_TYPE } from '@quadrats/core';

export type CreateJsxSerializeLineBreakOptions = Partial<CreateJsxSerializeElementOptions<JsxSerializeLineBreakElementProps>>;

export function createJsxSerializeLineBreak(options: CreateJsxSerializeLineBreakOptions = {}) {
  const { type = LINE_BREAK_TYPE, render = defaultRenderLineBreakElement } = options;

  return createJsxSerializeElement({ type, render });
}
