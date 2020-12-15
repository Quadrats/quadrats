import { createRenderMarkBase } from '@quadrats/react/_internal';
import { CreateRenderMarkOptions } from './typings/renderer';

export function createRenderMark<M>(options: CreateRenderMarkOptions<M>) {
  return createRenderMarkBase(options);
}
