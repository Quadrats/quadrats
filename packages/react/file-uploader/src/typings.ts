import { FileUploader, FileUploaderElement } from '@quadrats/common/file-uploader';
import { ReactEditor, RenderElementProps, WithCreateRenderElement } from '@quadrats/react';

export type RenderFileUploaderElementProps = RenderElementProps<FileUploaderElement>;

export type RenderFileUploaderElement = (props: RenderFileUploaderElementProps) => JSX.Element | null | undefined;

export interface FileUploaderCreateRenderElementOptions {
  render?: RenderFileUploaderElement;
}

export type ReactFileUploader = FileUploader<ReactEditor>
& WithCreateRenderElement<[FileUploaderCreateRenderElementOptions?]>;
