import { JSX } from 'react';
import { InputBlock, InputBlockElement } from '@quadrats/common/input-block';
import { Editor, RenderElementProps, WithCreateRenderElement } from '@quadrats/react';

export type RenderInputBlockElementProps = RenderElementProps<InputBlockElement> &
Pick<ReactInputBlock, 'remove' | 'confirm'>;

export type RenderInputBlockElement = (props: RenderInputBlockElementProps) => JSX.Element | null | undefined;

export interface ReactInputBlockCreateRenderElementOptions {
  render?: RenderInputBlockElement;
}

export interface ReactInputBlock
  extends Omit<InputBlock<Editor>, 'remove' | 'confirm'>,
  WithCreateRenderElement<[ReactInputBlockCreateRenderElementOptions?]> {
  remove(editor: Editor, element: InputBlockElement): void;
  confirm(editor: Editor, element: InputBlockElement, value: string): void;
}
