import {
  EmbedElement,
  EmbedStrategy,
} from '@quadrats/common/embed';
import {
  ReactEmbed,
  ReactEmbedCreateRenderElementOptions,
  RenderEmbedElementProps,
} from '@quadrats/react/embed';
import { JsxSerializeEmbedElementProps } from '@quadrats/react/embed/jsx-serializer';

export const createRenderElementDocgen = (options: ReactEmbedCreateRenderElementOptions<string>) => options;
export const ReactEmbedDocgen = (t: ReactEmbed<string>) => t;
export const EmbedElementDocgen = (element: EmbedElement) => element;
export const EmbedStrategyDocgen = (s: EmbedStrategy<any, any>) => s;
export const RenderEmbedElementPropsDocgen = (props: RenderEmbedElementProps<any, any>) => props;
export const JsxSerializeEmbedElementPropsDocgen = (props: JsxSerializeEmbedElementProps<any, any>) => props;
