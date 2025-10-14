import { FileUploaderUploadOptions } from '@quadrats/common/file-uploader';
import { Editor, useSlateStatic } from '@quadrats/react';
import { ReactFileUploader } from '@quadrats/react/file-uploader';

export function useFileUploaderTool(controller: ReactFileUploader, options: FileUploaderUploadOptions) {
  const editor = useSlateStatic() as Editor;

  return {
    onClick: () => {
      controller.insertUploaderPlaceholder(editor);
      controller.upload(editor, options);
    },
  };
}
