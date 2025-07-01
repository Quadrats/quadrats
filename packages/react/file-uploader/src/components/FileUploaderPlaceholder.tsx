import React from 'react';
import { RenderElementProps } from '@quadrats/react';

function FileUploaderPlaceholder(props: RenderElementProps) {
  const { attributes } = props;

  return (
    <div {...attributes} className="qdr-file-uploader__placeholder" contentEditable={false}>
      FileUploaderPlaceholder
    </div>
  );
}

export default FileUploaderPlaceholder;
