import React from 'react';
import { Progress } from '@quadrats/react/components';
import { RenderFileUploaderElementProps } from '../typings';
import { useFileUploader } from '../hooks/useFileUploader';

function FileUploader(props: RenderFileUploaderElementProps) {
  const { attributes, children, element } = props;
  const { percentage } = useFileUploader(element);

  return (
    <div {...attributes} className="qdr-file-uploader" contentEditable={false}>
      <div className="qdr-file-uploader__backdrop">
        <div className="qdr-file-uploader__backdrop__wrapper">
          <Progress percentage={percentage} />
          <p className="qdr-file-uploader__backdrop__percentage">{`${percentage}%`}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default FileUploader;
