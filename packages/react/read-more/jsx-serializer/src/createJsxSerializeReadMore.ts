import { READ_MORE_TYPE } from '@quadrats/common/read-more';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { JsxSerializeReadMoreProps } from './typings';
import { defaultRenderReadMoreElement } from './defaultRenderReadMoreElement';

export type CreateJsxSerializeReadMoreOptions = Partial<CreateJsxSerializeElementOptions<JsxSerializeReadMoreProps>>;

export function createJsxSerializeReadMore(options: CreateJsxSerializeReadMoreOptions = {}) {
  const { type = READ_MORE_TYPE, render = defaultRenderReadMoreElement } = options;
  return createJsxSerializeElement({ type, render });
}
