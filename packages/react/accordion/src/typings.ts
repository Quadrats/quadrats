import { Accordion, AccordionElement } from '@quadrats/common/accordion';
import { Editor } from '@quadrats/core';
import {
  AccordionTypeKey,
  AccordionTitleTypeKey,
  AccordionContentTypeKey,
} from '@quadrats/common/accordion';
import { WithCreateRenderElement, RenderElementProps } from '@quadrats/react';

export type AccordionContextType = {
  expanded: boolean;
};

export type RenderAccordionElementProps = RenderElementProps<AccordionElement>;

export type AccordionRenderElements = Record<
AccordionTypeKey,
(props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderAccordionElementProps['element'];
}) => JSX.Element | null | undefined
> &
Record<AccordionTitleTypeKey, (props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) => JSX.Element | null | undefined> &
Record<AccordionContentTypeKey, (props: {
  attributes?: RenderElementProps['attributes'];
  children: RenderElementProps['children'];
  element: RenderElementProps['element'];
}) => JSX.Element | null | undefined>;

export type ReactAccordionCreateRenderElementOptions = {
  [K in AccordionTypeKey | AccordionTitleTypeKey | AccordionContentTypeKey]?: AccordionRenderElements[K];
};

export interface ReactAccordion
  extends Accordion<Editor>, WithCreateRenderElement<[ReactAccordionCreateRenderElementOptions?]> {}
