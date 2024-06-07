import { createRenderElementsBase } from '@quadrats/react/_internal';
import { CreateRenderElementOptions, RenderElementProps } from './typings/renderer';

export function createRenderElements<P extends RenderElementProps>(options: CreateRenderElementOptions<P>[]) {
  return createRenderElementsBase<P, RenderElementProps>(options);
}
