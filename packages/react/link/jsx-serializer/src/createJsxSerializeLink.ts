import { LINK_TYPE } from '@quadrats/common/link';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { JsxSerializeLinkElementProps } from './typings';
import { defaultRenderLinkElement } from './defaultRenderLinkElement';

export type CreateJsxSerializeLinkOptions = Partial<CreateJsxSerializeElementOptions<JsxSerializeLinkElementProps>>;

export function createJsxSerializeLink(options: CreateJsxSerializeLinkOptions = {}) {
  const { type = LINK_TYPE, render = defaultRenderLinkElement } = options;
  return createJsxSerializeElement({ type, render });
}
