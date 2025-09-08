import type { BaseEditor } from 'slate';
import type { HistoryEditor } from 'slate-history';

export type QuadratsEditor = HistoryEditor & BaseEditor;

export type QuadratsElement = {
  type: string;
  children: (QuadratsElement | QuadratsText)[];
};

export type QuadratsText = {
  text: string;
};
