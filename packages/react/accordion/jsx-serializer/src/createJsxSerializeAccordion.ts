import { ACCORDION_TYPE } from '@quadrats/common/accordion';
import { createJsxSerializeElement, CreateJsxSerializeElementOptions } from '@quadrats/react/jsx-serializer';
import { JsxSerializeAccordionElementProps } from './typings';
import { defaultRenderAccordionElement } from './defaultRenderAccordionElement';

export type CreateJsxSerializeAccordionOptions = Partial<
CreateJsxSerializeElementOptions<JsxSerializeAccordionElementProps>
>;

export function createJsxSerializeAccordion(options: CreateJsxSerializeAccordionOptions = {}) {
  const { type = ACCORDION_TYPE, render = defaultRenderAccordionElement } = options;

  return createJsxSerializeElement<JsxSerializeAccordionElementProps>({ type, render });
}
