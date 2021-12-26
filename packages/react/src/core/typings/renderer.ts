import {
  RenderElementProps as SlateReactRenderElementProps,
  RenderLeafProps as SlateRenderLeafProps,
} from 'slate-react';
import { QuadratsElement } from '@quadrats/core';
import {
  CreateRenderElementOptionsBase,
  CreateRenderMarkOptionsBase,
  RenderElementPropsBase,
  RenderLeafPropsBase,
  RenderMarkPropsBase,
} from '@quadrats/react/_internal';

export type RenderLeafProps = RenderLeafPropsBase & Pick<SlateRenderLeafProps, 'attributes'>;

export type RenderMarkProps<M> = RenderMarkPropsBase<M>;

export type RenderElementProps<E extends QuadratsElement = QuadratsElement> = RenderElementPropsBase<E> &
Pick<SlateReactRenderElementProps, 'attributes'>;

export type CreateRenderMarkOptions<M> = CreateRenderMarkOptionsBase<M, RenderMarkProps<M>>;

export type CreateRenderElementOptions<P extends RenderElementProps<QuadratsElement>>
  = CreateRenderElementOptionsBase<P>;

export interface WithCreateRenderLeaf<P extends any[] = []> {
  createRenderLeaf: (...params: P) => (props: RenderLeafProps) => JSX.Element;
}

export interface WithCreateRenderElement<P extends any[] = []> {
  createRenderElement: (...params: P) => (props: RenderElementProps) => JSX.Element | null | undefined;
}
