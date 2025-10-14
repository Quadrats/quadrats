import {
  AccordionElement,
  AccordionTypeKey,
  AccordionTitleTypeKey,
  AccordionContentTypeKey,
} from '@quadrats/common/accordion';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export type JsxSerializeAccordionElementProps = JsxSerializeElementProps<AccordionElement>;

export type AccordionJsxSerializeElements = Record<
AccordionTypeKey,
(props: JsxSerializeAccordionElementProps) => JSX.Element | null | undefined
> &
Record<AccordionTitleTypeKey, (props: JsxSerializeElementProps) => JSX.Element | null | undefined> &
Record<AccordionContentTypeKey, (props: JsxSerializeElementProps) => JSX.Element | null | undefined>;
