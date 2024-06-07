import { createEmbed, CreateEmbedOptions } from '@quadrats/common/embed';
import { createRenderElement } from '@quadrats/react';
import { ReactEmbed, RenderEmbedElementProps } from './typings';
import { createRenderEmbedElementBase } from './createRenderEmbedElementBase';

export type CreateReactEmbedOptions<P extends string> = CreateEmbedOptions<P>;

export function createReactEmbed<P extends string>(options: CreateReactEmbedOptions<P>): ReactEmbed<P> {
  const core = createEmbed(options);
  const { type, strategies } = core;

  return {
    ...core,
    createRenderElement: options => createRenderElement<RenderEmbedElementProps<any, any>>({
      type,
      render: createRenderEmbedElementBase({ strategies, renderers: options }),
    }),
  };
}
