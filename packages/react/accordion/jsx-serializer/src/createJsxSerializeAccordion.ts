/* eslint-disable @typescript-eslint/naming-convention */
import {
  WithElementParent,
} from '@quadrats/core/serializers';
import {
  AccordionElement,
  AccordionTypeKey,
  AccordionTitleTypeKey,
  AccordionContentTypeKey,
  ACCORDION_TYPES,
} from '@quadrats/common/accordion';
import {
  CreateJsxSerializeElementOptions,
  createJsxSerializeElements,
  JsxSerializeElementProps,
} from '@quadrats/react/jsx-serializer';
import { defaultRenderAccordionElements } from './defaultRenderAccordionElements';
import {
  JsxSerializeAccordionElementProps,
} from './typings';

export type CreateJsxSerializeAccordionOptions = Partial<
Record<AccordionTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeAccordionElementProps>>> &
Record<AccordionTitleTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>> &
Record<AccordionContentTypeKey, Partial<CreateJsxSerializeElementOptions<JsxSerializeElementProps>>>
>;

export function createJsxSerializeAccordion(options: CreateJsxSerializeAccordionOptions = {}) {
  const {
    accordion = {},
    accordion_title = {},
    accordion_content = {},
  } = options;

  const accordionType = accordion.type || ACCORDION_TYPES.accordion;
  const titleType = accordion_title.type || ACCORDION_TYPES.accordion_title;
  const contentType = accordion_content.type || ACCORDION_TYPES.accordion_content;

  const renderAccordion = accordion.render || defaultRenderAccordionElements.accordion;
  const renderAccordionTitle = accordion_title.render || defaultRenderAccordionElements.accordion_title;
  const renderAccordionContent = accordion_content.render || defaultRenderAccordionElements.accordion_content;

  return createJsxSerializeElements([
    {
      type: accordionType,
      render: (props) => {
        const { children } = props;
        const element = props.element as AccordionElement & WithElementParent;

        return renderAccordion({
          children,
          element,
        });
      },
    },
    {
      type: titleType,
      render: (props) => {
        const { children, element } = props;

        return renderAccordionTitle({
          children,
          element,
        });
      },
    },
    {
      type: contentType,
      render: (props) => {
        const { children, element } = props;

        return renderAccordionContent({
          children,
          element,
        });
      },
    },
  ]);
}
