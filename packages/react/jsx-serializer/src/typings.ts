import { Element } from '@quadrats/core';
import { WithElementParent } from '@quadrats/core/serializers';
import {
  CreateRenderElementOptionsBase,
  CreateRenderMarkOptionsBase,
  RenderElementPropsBase,
  RenderLeafPropsBase,
  RenderMarkPropsBase,
} from '@quadrats/react/_internal';

export type JsxSerializeLeafProps = RenderLeafPropsBase;

export type JsxSerializeMarkProps<M> = RenderMarkPropsBase<M>;

export type JsxSerializeElementProps<E extends Element = Element> = RenderElementPropsBase<E & WithElementParent>;

export type CreateJsxSerializeMarkOptions<M> = CreateRenderMarkOptionsBase<M, JsxSerializeMarkProps<M>>;

export type CreateJsxSerializeElementOptions<P extends JsxSerializeElementProps> = CreateRenderElementOptionsBase<P>;
