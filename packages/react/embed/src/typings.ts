import { Embed, EmbedElement } from '@quadrats/common/embed';
import { WithCreateRenderElement, RenderElementProps } from '@quadrats/react';
import { WithEmbedRenderData } from '@quadrats/react/embed/common';

export interface RenderEmbedElementProps<EmbedData extends Record<string, unknown>, RenderData>
  extends RenderElementProps<EmbedElement & EmbedData>,
  WithEmbedRenderData<RenderData> {}

export type ReactEmbedCreateRenderElementOptions<Provider extends string> = Record<
Provider,
(props: RenderEmbedElementProps<any, any>) => JSX.Element | null | undefined
>;

export interface ReactEmbed<Provider extends string>
  extends Embed<Provider>,
  WithCreateRenderElement<[ReactEmbedCreateRenderElementOptions<Provider>]> {}
