import { createEditor as createSlateEditor } from 'slate';
import { withHistory as withSlateHistory } from 'slate-history';

export * from 'slate';
export * from 'slate-history';
export * from './adapter/slate';

export * from './paragraph';
export * from './line-break';
export * from './typings';

export * from './queries/getAboveBlock';
export * from './queries/getAboveByTypes';
export * from './queries/getMark';
export * from './queries/getNodes';
export * from './queries/getNodesByTypes';
export * from './queries/getParent';
export * from './queries/getPointBefore';
export * from './queries/getPointFromLocation';
export * from './queries/getRangeBefore';
export * from './queries/getRangeBeforeFromAboveBlockStart';
export * from './queries/getSelectionFragment';
export * from './queries/getSelectionText';
export * from './queries/isAboveBlockEmpty';
export * from './queries/isAncestorEmpty';
export * from './queries/isFirstChild';
export * from './queries/isNodeMatch';
export * from './queries/isNodesTypeIn';
export * from './queries/isPathAtRoot';
export * from './queries/isSelectionAtBlockEdge';

export * from './transforms/deleteSelectionFragmentIfExpanded';
export * from './transforms/insertSoftBreak';
export * from './transforms/toggleNodesType';
export * from './transforms/unhangRange';
export * from './transforms/unwrapNodesByTypes';
export * from './transforms/wrapNodesWithUnhangRange';

export * from './normalizers/normalizeOnlyAtRoot';
export * from './normalizers/normalizeOnlyInlineOrTextInChildren';
export * from './normalizers/normalizeVoidElementChildren';

export function createEditor() {
  return withSlateHistory(createSlateEditor());
}
