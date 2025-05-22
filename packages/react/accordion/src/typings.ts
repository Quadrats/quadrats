import { Accordion, AccordionElement } from '@quadrats/common/accordion';
import { WithCreateRenderElement, RenderElementProps, Editor } from '@quadrats/react';

export type RenderAccordionElementProps = RenderElementProps<AccordionElement>;

export interface ReactAccordionCreateRenderElementOptions {
  render?: (props: RenderAccordionElementProps) => JSX.Element | null | undefined;
}

export interface ReactAccordion
  extends Accordion<Editor>, WithCreateRenderElement<[ReactAccordionCreateRenderElementOptions?]> {}
