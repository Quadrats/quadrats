/* eslint-disable max-len */
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { FOOTNOTE_TYPE } from '@quadrats/common/footnote';
import { JsxSerializeFootnoteElementProps } from './typings';
import { defaultRenderFootnoteElement } from './defaultRenderFootnoteElement';

export type CreateJsxSerializeFootnoteOptions = Partial<CreateJsxSerializeElementOptions<JsxSerializeFootnoteElementProps>>;

export function createJsxSerializeFootnote(options: CreateJsxSerializeFootnoteOptions = {}) {
  const { type = FOOTNOTE_TYPE, render = defaultRenderFootnoteElement } = options;

  return createJsxSerializeElement({ type, render });
}
