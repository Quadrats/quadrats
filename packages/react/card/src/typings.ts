import { Dispatch, SetStateAction } from 'react';
import {
  Card,
  CardElement,
  CardImageElement,
  CardContentsElement,
  CardPlaceholderElement,
  CardTypeKey,
  CardImageTypeKey,
  CardContentsTypeKey,
} from '@quadrats/common/card';
import { RenderElementProps, Editor, WithCreateRenderElement, Handlers, ConfirmModalConfig } from '@quadrats/react';
import { LocaleDefinition } from '@quadrats/locales';

export interface RenderCardElementProps extends RenderElementProps<CardElement> {
  controller: Card<Editor>;
}

export interface RenderCardImageElementProps extends RenderElementProps<CardImageElement> {}

export interface RenderCardContentsElementProps extends RenderElementProps<CardContentsElement> {}

export interface RenderCardPlaceholderElementProps extends RenderElementProps<CardPlaceholderElement> {}

export type RenderCardPlaceholderElement = (props: RenderCardPlaceholderElementProps) => JSX.Element | null | undefined;

export type CardRenderElements = Record<
  CardTypeKey,
  (props: RenderCardElementProps) => JSX.Element | null | undefined
> &
  Record<CardImageTypeKey, (props: RenderCardImageElementProps) => JSX.Element | null | undefined> &
  Record<CardContentsTypeKey, (props: RenderCardContentsElementProps) => JSX.Element | null | undefined>;

export type ReactCardCreateRenderElementOptions = {
  [K in CardTypeKey | CardImageTypeKey | CardContentsTypeKey]?: CardRenderElements[K];
};

export interface ReactCard extends Card<Editor>, WithCreateRenderElement<[ReactCardCreateRenderElementOptions?]> {
  createHandlers: (
    setNeedConfirmModal?: Dispatch<SetStateAction<ConfirmModalConfig | null>>,
    locale?: LocaleDefinition,
  ) => Handlers;
  createRenderPlaceholderElement: (params_0?: {
    render?: RenderCardPlaceholderElement;
  }) => (props: RenderElementProps) => JSX.Element | null | undefined;
}
