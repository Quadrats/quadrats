import { HistoryEditor } from 'slate-history';

export type QuadratsEditor = HistoryEditor;

export type QuadratsElement = {
  type: string;
  children: (QuadratsElement | QuadratsText)[];
};

export type QuadratsText = {
  text: string
};
