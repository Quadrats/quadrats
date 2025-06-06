import React, { ReactNode, useState } from 'react';
import { Transforms } from '@quadrats/core';
import { EmbedElement } from '@quadrats/common/embed';
import { RenderElementPropsBase } from '@quadrats/react/_internal';
import { AlignLeft, AlignCenter, AlignRight, Edit, Trash } from '@quadrats/icons';
import { ReactEditor, useSlateStatic } from '@quadrats/react';
import { useModal, Input } from '../../../components/src';
import { InlineToolbar } from '../../../toolbar/src';
import { WithEmbedRenderData } from '../typings';

export interface EmbedBaseProps {
  embedProps: RenderElementPropsBase<EmbedElement> & WithEmbedRenderData<any>
  children: ReactNode;
}

export const EmbedBaseWithoutToolbar = ({
  children,
}: EmbedBaseProps) => {
  return <div className="qdr-embed">{children}</div>;
};

const EmbedBase = ({
  embedProps,
  children,
}: EmbedBaseProps) => {
  const { element } = embedProps;
  const { openModal } = useModal();
  const [embedValue, setEmbedValue] = useState<string>('');
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <div className="qdr-embed">
      <InlineToolbar
        className="qdr-embed__inline-toolbar"
        leftIcons={[
          {
            icon: AlignLeft,
            onClick: () => {

            },
            active: false,
          },
          {
            icon: AlignCenter,
            onClick: () => {

            },
            active: false,
          },
          {
            icon: AlignRight,
            onClick: () => {

            },
            active: false,
          },
        ]}
        rightIcons={[
          {
            icon: Edit,
            onClick: () => {
              openModal({
                title: '嵌入連結',
                children: (
                  <>
                    <Input
                      value={embedValue}
                      onChange={(v) => {
                        setEmbedValue(v);
                      }}
                      placeholder="貼上語法"
                    />
                  </>
                ),
                onConfirm: () => {
                  console.log('confirm', embedValue);
                },
              });
            },
          },
          {
            icon: Trash,
            onClick: () => {
              Transforms.removeNodes(editor, { at: path });
            },
          },
        ]}
      />
      {children}
    </div>
  );
};

export default EmbedBase;