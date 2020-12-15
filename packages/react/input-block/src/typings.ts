import { InputBlock, InputBlockElement } from '@quadrats/common/input-block';
import { ReactEditor, RenderElementProps, WithCreateRenderElement } from '@quadrats/react';

export type RenderInputBlockElementProps = RenderElementProps<InputBlockElement> &
Pick<ReactInputBlock, 'remove' | 'confirm'>;

export type RenderInputBlockElement = (props: RenderInputBlockElementProps) => JSX.Element | null | undefined;

export interface ReactInputBlockCreateRenderElementOptions {
  render?: RenderInputBlockElement;
}

export interface ReactInputBlock
  extends Omit<InputBlock, 'remove' | 'confirm'>,
  WithCreateRenderElement<[ReactInputBlockCreateRenderElementOptions?]> {
  remove(editor: ReactEditor, element: InputBlockElement): void;
  confirm(editor: ReactEditor, element: InputBlockElement, value: string): void;
}
