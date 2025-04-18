import { createInputBlock, CreateInputBlockOptions } from '@quadrats/common/input-block';
import { createRenderElement, ReactEditor } from '@quadrats/react';
import { ReactInputBlock, RenderInputBlockElementProps } from './typings';
import { defaultRenderInputBlockElement } from './defaultRenderInputBlockElement';

export type CreateReactInputBlockOptions = CreateInputBlockOptions;

export function createReactInputBlock(options: CreateInputBlockOptions = {}): ReactInputBlock {
  const core = createInputBlock(options);
  const { type } = core;
  const remove: ReactInputBlock['remove'] = (editor, element) => core.remove(
    editor,
    [element, ReactEditor.findPath(editor, element)],
    () => ReactEditor.focus(editor),
  );

  const confirm: ReactInputBlock['confirm'] = (editor, element, value) => core.confirm(
    element,
    value,
    () => remove(editor, element),
  );

  return {
    ...core,
    remove,
    confirm,
    createRenderElement: ({
      render = defaultRenderInputBlockElement,
    } = {}) => createRenderElement<RenderInputBlockElementProps>({
      type,
      render: props => render({ ...props, remove, confirm }),
    }),
  };
}
