import React from 'react';
import { RenderElementProps } from '@quadrats/react';
import { Icon } from '@quadrats/react/components';
import { Image } from '@quadrats/icons';

function ImagePlaceholder(props: RenderElementProps) {
  const { attributes } = props;

  return (
    <div {...attributes} className="qdr-image__placeholder" contentEditable={false}>
      <Icon className="qdr-image__placeholder__icon" icon={Image} width={48} height={48} />
    </div>
  );
}

export default ImagePlaceholder;
