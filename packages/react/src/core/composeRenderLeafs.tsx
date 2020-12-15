import React from 'react';
import { composeRenderLeafsBase } from '@quadrats/react/_internal';
import { RenderLeafProps } from './typings/renderer';
import DefaultLeaf from './components/DefaultLeaf';

/**
 * To compose sequential `renderLeaf`s or `renderMark`s to single.
 */
export function composeRenderLeafs(renderLeafs: ((props: RenderLeafProps) => JSX.Element)[]) {
  return composeRenderLeafsBase((props) => <DefaultLeaf {...props} />, renderLeafs);
}
