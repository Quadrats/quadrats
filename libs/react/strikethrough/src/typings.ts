import { Text } from 'slate';

export interface StrikethroughLeaf extends Text {
  strikethrough: boolean;
  strikethroughVariant?: string;
}
