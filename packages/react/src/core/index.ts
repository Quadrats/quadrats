import { QuadratsEditor, QuadratsElement, QuadratsText } from '@quadrats/core';
import { ReactEditor } from 'slate-react';
import { PLACEHOLDER_KEY } from './constants';

export {
  useSlateStatic,
  useFocused,
  useReadOnly,
  useSelected,
  useSlate as useQuadrats,
  ReactEditor,
} from 'slate-react';

export * from './typings/handler';
export * from './typings/renderer';
export * from './typings/with';
export * from './typings/descendant';

export { Editor } from '@quadrats/core';
export { default as Editable, EditableProps } from './components/Editable';
export { default as DefaultElement } from './components/DefaultElement';
export { default as DefaultLeaf } from './components/DefaultLeaf';
export { default as Quadrats, QuadratsProps } from './components/Quadrats';

export * from './contexts/modal/modal';
export * from './contexts/modal/ModalProvider';

export * from './contexts/message/message';
export * from './contexts/message/MessageProvider';

export * from './contexts/composition/composition';
export * from './contexts/composition/CompositionProvider';

export { composeHandlers } from './composeHandlers';
export { composeRenderElements } from './composeRenderElements';
export { composeRenderLeafs } from './composeRenderLeafs';
export { createReactEditor } from './createReactEditor';
export { createRenderElement } from './createRenderElement';
export { createRenderElements } from './createRenderElements';
export { createRenderMark } from './createRenderMark';
export { PLACEHOLDER_KEY };

export type QuadratsReactEditor = QuadratsEditor & ReactEditor;

declare module '@quadrats/core' {
  interface CustomTypes {
    Editor: QuadratsReactEditor;
    Element: QuadratsElement;
    Text: QuadratsText & {
      [PLACEHOLDER_KEY]?: boolean;
    };
  }
}
