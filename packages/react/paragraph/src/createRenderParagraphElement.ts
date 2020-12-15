import { ParagraphElement, PARAGRAPH_TYPE } from '@quadrats/core';
import { createRenderElement, RenderElementProps } from '@quadrats/react';
import { defaultRenderParagraphElement } from './defaultRenderParagraphElement';

export type RenderParagraphElementProps = RenderElementProps<ParagraphElement>;

export interface CreateRenderParagraphElementOptions {
  render?: (props: RenderParagraphElementProps) => JSX.Element | null | undefined;
}

export function createRenderParagraphElement(options: CreateRenderParagraphElementOptions = {}) {
  const { render = defaultRenderParagraphElement } = options;
  return createRenderElement({ type: PARAGRAPH_TYPE, render });
}
