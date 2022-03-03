import { QuadratsEditor, QuadratsElement, QuadratsText } from '@quadrats/core';
import { ReactEditor } from 'slate-react';

export {
  useSlateStatic,
  useFocused,
  useReadOnly,
  useSelected,
  useSlate as useQuadrats,
  ReactEditor,
} from 'slate-react';

export { Editor } from '@quadrats/core';

export * from './typings/handler';
export * from './typings/renderer';
export * from './typings/with';
export * from './typings/descendant';

export { default as Editable, EditableProps } from './components/Editable';
export { default as DefaultElement } from './components/DefaultElement';
export { default as DefaultLeaf } from './components/DefaultLeaf';
export { default as Quadrats, QuadratsProps } from './components/Quadrats';

export { composeHandlers } from './composeHandlers';
export { composeRenderElements } from './composeRenderElements';
export { composeRenderLeafs } from './composeRenderLeafs';
export { createReactEditor } from './createReactEditor';
export { createRenderElement } from './createRenderElement';
export { createRenderElements } from './createRenderElements';
export { createRenderMark } from './createRenderMark';

export interface QuadratsReactEditor extends QuadratsEditor, ReactEditor {}

declare module '@quadrats/core' {
  interface CustomTypes {
    Editor: QuadratsReactEditor
    Element: QuadratsElement
    Text: QuadratsText
  }
}
