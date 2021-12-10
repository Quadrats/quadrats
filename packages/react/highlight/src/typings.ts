import { Text } from 'slate';

export interface HighlightLeaf extends Text {
  highlight: boolean;
  highlightVariant?: string;
}
