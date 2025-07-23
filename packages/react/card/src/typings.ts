import {
  CardPlaceholderElement,
  // CardTypeKey,
  // CardImageTypeKey,
  // CardContentsTypeKey,
} from '@quadrats/common/card';
import { RenderElementProps } from '@quadrats/react';

export interface RenderCardPlaceholderElementProps extends RenderElementProps<CardPlaceholderElement> {}

export type RenderCardPlaceholderElement = (props: RenderCardPlaceholderElementProps) => JSX.Element | null | undefined;
