import { Descendant } from 'slate';
import { isText } from './isText';

export function getMergedNodeTexts(node: Descendant): string {
  if (isText(node)) {
    return node.text;
  }

  return (node?.children ?? []).map((child) => getMergedNodeTexts(child)).join();
}
