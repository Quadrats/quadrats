import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Path, Transforms } from '@quadrats/core';
import { EmbedElement } from '@quadrats/common/embed';
import { AlignLeft, AlignCenter, AlignRight, Edit, Trash } from '@quadrats/icons';
import { QuadratsReactEditor, ReactEditor, useSlateStatic } from '@quadrats/react';
import { useModal, Input, Textarea } from '@quadrats/react/components';
import { InlineToolbar } from '@quadrats/react/toolbar';

export interface BaseEmbedElementProps {
  element: EmbedElement;
  type?: 'input' | 'textarea';
  placeholder?: string;
  hint?: string;
  onConfirm?: (editor: QuadratsReactEditor, path: Path, value: string) => void;
  children: ReactNode;
}

export const BaseEmbedElementWithoutToolbar = ({
  children,
}: BaseEmbedElementProps) => {
  return <div className="qdr-embed">{children}</div>;
};

const BaseEmbedElement = ({
  element,
  type = 'input',
  placeholder,
  hint,
  onConfirm,
  children,
}: BaseEmbedElementProps) => {
  const { openModal } = useModal();
  const modalConfigRef = useRef('');
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
                children: (() => {
                  const EmbedComponent = () => {
                    const [value, setValue] = useState('');

                    useEffect(() => {
                      modalConfigRef.current = value;
                    }, [value]);

                    if (type === 'textarea') {
                      return (
                        <Textarea
                          value={value}
                          onChange={setValue}
                          placeholder={placeholder}
                          hint={hint}
                        />
                      );
                    }

                    return (
                      <Input
                        value={value}
                        onChange={setValue}
                        placeholder={placeholder}
                        hint={hint}
                      />
                    );
                  };

                  return <EmbedComponent />;
                })(),
                onConfirm: () => {
                  onConfirm?.(editor, path, modalConfigRef.current);
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

export default BaseEmbedElement;
