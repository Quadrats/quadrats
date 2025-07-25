import {
  CardElement,
  CardImageElement,
  CardContentsElement,
  CardTypeKey,
  CardImageTypeKey,
  CardContentsTypeKey,
} from '@quadrats/common/card';
import { JsxSerializeElementProps } from '@quadrats/react/jsx-serializer';

export interface JsxSerializeCardElementProps extends JsxSerializeElementProps<CardElement> {}
export interface JsxSerializeCardImageElementProps extends JsxSerializeElementProps<CardImageElement> {}
export interface JsxSerializeCardContentsElementProps extends JsxSerializeElementProps<CardContentsElement> {}

export type CardJsxSerializeElements = Record<
  CardTypeKey,
  (props: JsxSerializeCardElementProps) => JSX.Element | null | undefined
> &
  Record<CardImageTypeKey, (props: JsxSerializeCardImageElementProps) => JSX.Element | null | undefined> &
  Record<CardContentsTypeKey, (props: JsxSerializeCardContentsElementProps) => JSX.Element | null | undefined>;
