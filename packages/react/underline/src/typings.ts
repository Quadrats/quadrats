import { Text } from 'slate';

export interface UnderlineLeaf extends Text {
  underline: boolean;
  underlineVariant?: string;
}
