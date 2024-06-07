import { HEADING_TYPE } from '@quadrats/common/heading';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { defaultRenderHeadingElement } from './defaultRenderHeadingElement';
import { JsxSerializeHeadingElementProps } from './typings';

export type CreateJsxSerializeHeadingOptions = Partial<
CreateJsxSerializeElementOptions<JsxSerializeHeadingElementProps>
>;

export function createJsxSerializeHeading(options: CreateJsxSerializeHeadingOptions = {}) {
  const { type = HEADING_TYPE, render = defaultRenderHeadingElement } = options;
  return createJsxSerializeElement<JsxSerializeHeadingElementProps>({ type, render });
}
