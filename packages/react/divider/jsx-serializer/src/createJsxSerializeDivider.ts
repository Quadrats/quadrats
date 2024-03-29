import { DIVIDER_TYPE } from '@quadrats/common/divider';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { JsxSerializeDividerProps } from './typings';
import { defaultRenderDividerElement } from './defaultRenderDividerElement';

export type CreateJsxSerializeDividerOptions = Partial<CreateJsxSerializeElementOptions<JsxSerializeDividerProps>>;

export function createJsxSerializeDivider(options: CreateJsxSerializeDividerOptions = {}) {
  const { type = DIVIDER_TYPE, render = defaultRenderDividerElement } = options;

  return createJsxSerializeElement({ type, render });
}
