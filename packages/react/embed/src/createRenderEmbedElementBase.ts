import { JSX } from 'react';
import { deserializeEmbedElementToData, EmbedElement, EmbedStrategies } from '@quadrats/common/embed';
import { RenderElementPropsBase } from '@quadrats/react/_internal';
import { WithEmbedRenderData } from './typings';

export function createRenderEmbedElementBase<
  P extends string,
  RP extends RenderElementPropsBase<EmbedElement> & WithEmbedRenderData<any>,
>({
  strategies,
  renderers,
}: {
  strategies: EmbedStrategies<P>;
  renderers: {
    [K in P]: (props: RP) => JSX.Element | null | undefined;
  };
}): (props: RP) => JSX.Element | null | undefined {
  return (props) => {
    const result = deserializeEmbedElementToData(props.element, strategies);

    if (result) {
      const [provider, data] = result;
      const render = renderers[provider];

      return render({ ...props, data });
    }
  };
}
