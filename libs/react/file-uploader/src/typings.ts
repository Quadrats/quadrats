import { FileUploader, FileUploaderElement } from '@quadrats/common/file-uploader';
import { Editor, RenderElementProps, WithCreateRenderElement } from '@quadrats/react';

export type RenderFileUploaderElementProps = RenderElementProps<FileUploaderElement>;

export type RenderFileUploaderElement = (props: RenderFileUploaderElementProps) => JSX.Element | null | undefined;

export interface FileUploaderCreateRenderElementOptions {
  render?: RenderFileUploaderElement;
}

export type ReactFileUploader = FileUploader<Editor>
& WithCreateRenderElement<[FileUploaderCreateRenderElementOptions?]>;
