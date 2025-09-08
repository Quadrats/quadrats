import { Align, AlignValue } from '@quadrats/common/align';
import { Editor } from '@quadrats/core';
import { Handlers } from '@quadrats/react';

export interface AlignLeaf {
  align?: AlignValue;
  alignVariant?: string;
}

export interface ReactAlignCreateHandlersOptions {
  hotkeys?: {
    left?: string;
    center?: string;
    right?: string;
  };
}

export interface ReactAlign<E extends Editor = Editor> extends Align<E> {
  createHandlers: (options?: ReactAlignCreateHandlersOptions) => Handlers;
}
