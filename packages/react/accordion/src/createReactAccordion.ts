import { createAccordion, CreateAccordionOptions } from '@quadrats/common/accordion';
import { createRenderElement } from '@quadrats/react';
import { defaultRenderAccordionElement } from './defaultRenderAccordionElement';
import { ReactAccordion } from './typings';

export type CreateReactAccordionOptions = CreateAccordionOptions;

export function createReactAccordion(options: CreateReactAccordionOptions): ReactAccordion {
  const core = createAccordion(options);
  const { type } = core;

  return {
    ...core,
    createRenderElement: ({ render = defaultRenderAccordionElement } = {}) => createRenderElement({ type, render }),
  };
}
