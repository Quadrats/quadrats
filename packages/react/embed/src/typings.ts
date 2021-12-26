import { Embed, EmbedElement } from '@quadrats/common/embed';
import { WithCreateRenderElement, RenderElementProps, ReactEditor } from '@quadrats/react';

export interface WithEmbedRenderData<RenderData> {
  /**
   * The data deserialized from element by corresponding strategy.
   */
  data: RenderData;
}

export interface RenderEmbedElementProps<EmbedData extends Record<string, unknown>, RenderData>
  extends RenderElementProps<EmbedElement & EmbedData>,
  WithEmbedRenderData<RenderData> {}

export type ReactEmbedCreateRenderElementOptions<Provider extends string> = Record<
Provider,
(props: RenderEmbedElementProps<any, any>) => JSX.Element | null | undefined
>;

export interface ReactEmbed<Provider extends string>
  extends Embed<Provider, ReactEditor>,
  WithCreateRenderElement<[ReactEmbedCreateRenderElementOptions<Provider>]> {}
