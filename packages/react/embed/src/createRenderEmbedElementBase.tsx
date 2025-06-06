import React, { JSX } from 'react';
import { deserializeEmbedElementToData, EmbedElement, EmbedStrategies } from '@quadrats/common/embed';
import { RenderElementPropsBase } from '@quadrats/react/_internal';
import EmbedBase, { EmbedBaseWithoutToolbar } from './components/EmbedBase';
import { WithEmbedRenderData } from './typings';

export function createRenderEmbedElementBase<
  P extends string,
  RP extends RenderElementPropsBase<EmbedElement> & WithEmbedRenderData<any>,
>({
  strategies,
  renderers,
  withoutToolbar,
}: {
  strategies: EmbedStrategies<P>;
  renderers: {
    [K in P]: (props: RP) => JSX.Element | null | undefined;
  };
  withoutToolbar?: boolean;
}): (props: RP) => JSX.Element | null | undefined {
  return (props) => {
    const result = deserializeEmbedElementToData(props.element, strategies);

    if (result) {
      const [provider, data] = result;
      const render = renderers[provider];

      if (withoutToolbar) {
        return <EmbedBaseWithoutToolbar embedProps={props}>{render({ ...props, data })}</EmbedBaseWithoutToolbar>;
      }

      return <EmbedBase embedProps={props}>{render({ ...props, data })}</EmbedBase>;
    }
  };
}
