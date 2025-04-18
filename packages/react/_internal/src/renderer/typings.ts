import { JSX } from 'react';
import {
  QuadratsElement,
  Text,
  WithElementType,
  WithMarkType,
} from '@quadrats/core';

export interface RenderLeafPropsBase {
  children: any;
  leaf: Text;
}

export interface RenderMarkPropsBase<M> extends RenderLeafPropsBase {
  mark: M;
}

export interface RenderElementPropsBase<E extends QuadratsElement = QuadratsElement> {
  children: any;
  element: E;
}

export interface CreateRenderMarkOptionsBase<M, P extends RenderMarkPropsBase<M>> extends WithMarkType {
  render: (props: P) => JSX.Element;
}

export interface CreateRenderElementOptionsBase<P extends
RenderElementPropsBase<QuadratsElement>> extends WithElementType {
  render: (props: P) => JSX.Element | null | undefined;
}
