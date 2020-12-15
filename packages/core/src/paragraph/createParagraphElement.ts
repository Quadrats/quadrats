import { Descendant } from 'slate';
import { PARAGRAPH_TYPE } from './constants';

export function createParagraphElement(children: Descendant[] = [{ text: '' }]) {
  return { type: PARAGRAPH_TYPE, children };
}
