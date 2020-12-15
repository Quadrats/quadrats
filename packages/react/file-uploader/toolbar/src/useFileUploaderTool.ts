import { HistoryEditor } from '@quadrats/core';
import { FileUploaderUploadOptions } from '@quadrats/common/file-uploader';
import { ReactEditor, useEditor } from '@quadrats/react';
import { ReactFileUploader } from '@quadrats/react/file-uploader';

export function useFileUploaderTool(controller: ReactFileUploader, options: FileUploaderUploadOptions) {
  const editor = useEditor() as ReactEditor & HistoryEditor;

  return {
    onClick: () => controller.upload(editor, options),
  };
}
