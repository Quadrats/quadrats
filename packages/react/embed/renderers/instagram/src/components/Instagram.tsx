import React, { useEffect, ReactNode } from 'react';
import clsx from 'clsx';
import { InstagramEmbedElement } from '@quadrats/common/embed/strategies/instagram';
import { RenderElementProps } from '@quadrats/react';
import { useLoadInstagramEmbedApi } from '../hooks/useLoadInstagramEmbedApi';

export interface InstagramProps {
  attributes?: RenderElementProps['attributes'];
  children?: any;
  data: string;
  element: InstagramEmbedElement;
  toolbarElement: ReactNode;
}

function Instagram({ attributes, children, data: permalink, element: { align }, toolbarElement }: InstagramProps) {
  useLoadInstagramEmbedApi(permalink);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if ((node as HTMLElement).tagName === 'IFRAME') {
            const iframeNode = node as HTMLIFrameElement;

            if (iframeNode.src.includes('instagram.com')) {
              iframeNode.setAttribute('title', 'Instagram 貼文');
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      {...attributes}
      className={clsx('qdr-embed-instagram', {
        'qdr-embed-instagram--left': align === 'left' || !align,
        'qdr-embed-instagram--center': align === 'center',
        'qdr-embed-instagram--right': align === 'right',
      })}
      contentEditable={false}
      style={{
        display: 'flex',
        marginBottom: -12,
      }}
    >
      <div
        className="qdr-embed__inline-toolbar-wrapper"
        style={{
          maxWidth: 540,
          minWidth: 326,
          width: 'calc(100% - 2px)',
        }}
      >
        {toolbarElement}
        <blockquote
          className="instagram-media"
          data-instgrm-captioned
          data-instgrm-permalink={permalink}
          data-instgrm-version="13"
          style={{
            background: '#FFF',
            border: 0,
            borderRadius: 3,
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: 1,
            maxWidth: 540,
            minWidth: 326,
            padding: 0,
            width: 'calc(100% - 2px)',
          }}
        />
        {attributes ? children : undefined}
      </div>
    </div>
  );
}

export default Instagram;
