import { Text } from 'slate';

export interface BoldLeaf extends Text {
  bold: boolean;
  boldVariant?: string;
}
