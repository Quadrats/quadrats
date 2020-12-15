import { createRenderElementBase } from '@quadrats/react/_internal';
import { CreateJsxSerializeElementOptions, JsxSerializeElementProps } from './typings';

export function createJsxSerializeElement<P extends JsxSerializeElementProps>(
  options: CreateJsxSerializeElementOptions<P>,
) {
  return createRenderElementBase<P, JsxSerializeElementProps>(options);
}
