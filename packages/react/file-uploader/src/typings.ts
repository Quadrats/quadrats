import { JSX } from 'react';
import { FileUploader, FileUploaderElement } from '@quadrats/common/file-uploader';
import { Editor, RenderElementProps, WithCreateRenderElement } from '@quadrats/react';

export type RenderFileUploaderElementProps = RenderElementProps<FileUploaderElement>;

export type RenderFileUploaderElement = (props: RenderFileUploaderElementProps) => JSX.Element | null | undefined;
export type RenderFileUploaderPlaceholderElement = (props: RenderElementProps) =>
JSX.Element | null | undefined;

export interface FileUploaderCreateRenderElementOptions {
  render?: RenderFileUploaderElement;
}

export type ReactFileUploader = FileUploader<Editor>
& WithCreateRenderElement<[FileUploaderCreateRenderElementOptions?]> & {
  createRenderPlaceholderElement: (params_0: { render: RenderFileUploaderPlaceholderElement }) =>
  (props: RenderElementProps) => JSX.Element | null | undefined;
};
