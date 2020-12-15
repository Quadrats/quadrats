import { PARAGRAPH_TYPE } from '@quadrats/core';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { defaultRenderParagraphElement } from './defaultRenderParagraphElement';
import { JsxSerializeParagraphProps } from './typings';

export type CreateJsxSerializeParagraphOptions = Partial<
Omit<CreateJsxSerializeElementOptions<JsxSerializeParagraphProps>, 'type'>
>;

export function createJsxSerializeParagraph(options: CreateJsxSerializeParagraphOptions = {}) {
  const { render = defaultRenderParagraphElement } = options;
  return createJsxSerializeElement<JsxSerializeParagraphProps>({ type: PARAGRAPH_TYPE, render });
}
