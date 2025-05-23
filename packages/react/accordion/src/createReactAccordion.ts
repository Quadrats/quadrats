import { AccordionElement, createAccordion, CreateAccordionOptions } from '@quadrats/common/accordion';
import { createRenderElements, RenderElementProps } from '@quadrats/react';
import { defaultRenderAccordionElements } from './defaultRenderAccordionElements';
import { ReactAccordion } from './typings';

export type CreateReactAccordionOptions = CreateAccordionOptions;

export function createReactAccordion(options: CreateReactAccordionOptions = {}): ReactAccordion {
  const core = createAccordion(options);
  const { types } = core;

  return {
    ...core,
    createRenderElement: (options = {}) => {
      const renderAccordion = options.accordion || defaultRenderAccordionElements.accordion;
      const renderAccordionTitle = options.accordion_title || defaultRenderAccordionElements.accordion_title;
      const renderAccordionContent = options.accordion_content
        || defaultRenderAccordionElements.accordion_content;

      return createRenderElements([
        {
          type: types.accordion,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps<AccordionElement>;

            return renderAccordion({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.accordion_title,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderAccordionTitle({
              attributes,
              element,
              children,
            });
          },
        },
        {
          type: types.accordion_content,
          render: (props) => {
            const { attributes, children, element } = props as RenderElementProps;

            return renderAccordionContent({
              attributes,
              element,
              children,
            });
          },
        },
      ]);
    },
  };
}
