import { createRenderMarkBase } from '@quadrats/react/_internal';
import { CreateJsxSerializeMarkOptions } from './typings';

export function createJsxSerializeMark<M>(options: CreateJsxSerializeMarkOptions<M>) {
  return createRenderMarkBase(options);
}
