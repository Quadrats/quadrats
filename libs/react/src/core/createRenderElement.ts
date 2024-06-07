import { createRenderElementBase } from '@quadrats/react/_internal';
import { CreateRenderElementOptions, RenderElementProps } from './typings/renderer';

export function createRenderElement<P extends RenderElementProps>(options: CreateRenderElementOptions<P>) {
  return createRenderElementBase<P, RenderElementProps>(options);
}
