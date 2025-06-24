import React, { ReactNode } from 'react';
import clsx from 'clsx';
import { FacebookDeserializedEmbedData, FacebookEmbedElement } from '@quadrats/common/embed/strategies/facebook';
import { RenderElementProps } from '@quadrats/react';

export interface FacebookProps {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: FacebookDeserializedEmbedData;
  element: FacebookEmbedElement;
  toolbarElement: ReactNode;
}

function Facebook({
  attributes,
  children,
  data: { url, width, height },
  element: { align },
  toolbarElement,
}: FacebookProps) {
  return (
    <div
      {...attributes}
      className={clsx('qdr-embed-facebook', {
        'qdr-embed-facebook--left': align === 'left' || !align,
        'qdr-embed-facebook--center': align === 'center',
        'qdr-embed-facebook--right': align === 'right',
      })}
      contentEditable={false}
    >
      <div className="qdr-embed__inline-toolbar-wrapper" style={{ width, height }}>
        {toolbarElement}
        <iframe
          title={url}
          src={url}
          width={width}
          height={height}
          style={{
            border: 0,
            overflow: 'hidden',
          }}
          scrolling="no"
          frameBorder="0"
          //  eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //  @ts-ignore
          //  eslint-disable-next-line react/no-unknown-property
          allowtransparency="true"
          allow="encrypted-media"
        />
        {attributes ? children : undefined}
      </div>
    </div>
  );
}

export default Facebook;
