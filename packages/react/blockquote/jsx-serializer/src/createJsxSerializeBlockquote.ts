import { BLOCKQUOTE_TYPE } from '@quadrats/common/blockquote';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { defaultRenderBlockquoteElement } from './defaultRenderBlockquoteElement';
import { JsxSerializeBlockquoteElementProps } from './typings';

export type CreateJsxSerializeBlockquoteOptions = Partial<
CreateJsxSerializeElementOptions<JsxSerializeBlockquoteElementProps>
>;

export function createJsxSerializeBlockquote(options: CreateJsxSerializeBlockquoteOptions = {}) {
  const { type = BLOCKQUOTE_TYPE, render = defaultRenderBlockquoteElement } = options;

  return createJsxSerializeElement<JsxSerializeBlockquoteElementProps>({ type, render });
}
