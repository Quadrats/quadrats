import { BaseEditor } from 'slate';
import { HistoryEditor } from 'slate-history';

export interface QuadratsEditor extends BaseEditor, HistoryEditor {}

export type QuadratsElement = {
  type: string;
  children: (QuadratsElement | QuadratsText)[];
};

export type QuadratsText = {
  text: string
};
