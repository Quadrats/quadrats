import { EmbedStrategies, EMBED_TYPE } from '@quadrats/common/embed';
import { createRenderEmbedElementBase } from '@quadrats/react/embed';
import { createJsxSerializeElement } from '@quadrats/react/jsx-serializer';
import { JsxSerializeEmbedElementProps } from './typings';

export interface CreateJsxSerializeEmbedOptions<Provider extends string> {
  type?: string;
  strategies: EmbedStrategies<Provider>;
  renderers: Record<Provider, (props: JsxSerializeEmbedElementProps<any, any>) => JSX.Element | null | undefined>;
}

export function createJsxSerializeEmbed<Provider extends string>(options: CreateJsxSerializeEmbedOptions<Provider>) {
  const { type = EMBED_TYPE, strategies, renderers } = options;

  return createJsxSerializeElement<JsxSerializeEmbedElementProps<any, any>>({
    type,
    render: createRenderEmbedElementBase({ strategies, renderers }),
  });
}
