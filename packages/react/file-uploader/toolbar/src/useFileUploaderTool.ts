import { FileUploaderUploadOptions } from '@quadrats/common/file-uploader';
import { ReactEditor, useSlateStatic } from '@quadrats/react';
import { ReactFileUploader } from '@quadrats/react/file-uploader';

export function useFileUploaderTool(controller: ReactFileUploader, options: FileUploaderUploadOptions) {
  const editor = useSlateStatic() as ReactEditor;

  return {
    onClick: () => controller.upload(editor, options),
  };
}
