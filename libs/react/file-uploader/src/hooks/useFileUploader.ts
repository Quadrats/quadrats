import { useLayoutEffect, useState } from 'react';
import { FileUploaderElement } from '@quadrats/common/file-uploader';
import { ReactEditor, useSlateStatic } from '@quadrats/react';

export function useFileUploader(element: FileUploaderElement) {
  const [percentage, setPercentage] = useState(0);
  const editor = useSlateStatic();

  useLayoutEffect(() => element.register(() => ReactEditor.findPath(editor, element), setPercentage), [element]);

  return {
    percentage,
  };
}
