import { QuadratsElement } from '@quadrats/core';
import { CreateRenderElementOptionsBase, RenderElementPropsBase } from './typings';

export function createRenderElementBase<P extends RenderElementPropsBase, RP extends RenderElementPropsBase>({
  type,
  render,
}: CreateRenderElementOptionsBase<P>): (props: RP) => JSX.Element | null | undefined {
  return (props) => {
    if ((props.element as QuadratsElement).type === type) {
      return render((props as any) as P);
    }
  };
}
