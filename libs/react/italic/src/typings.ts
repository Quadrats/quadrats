import { Text } from 'slate';

export interface ItalicLeaf extends Text {
  italic: boolean;
  italicVariant?: string;
}
