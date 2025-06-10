import React, { ReactNode, useState, useEffect, useRef } from 'react';
import { Path, Transforms } from '@quadrats/core';
import { EmbedElement } from '@quadrats/common/embed';
import { AlignLeft, AlignCenter, AlignRight, Edit, Trash } from '@quadrats/icons';
import { QuadratsReactEditor, ReactEditor, useSlateStatic, useLocale } from '@quadrats/react';
import { useModal, Input, Textarea } from '@quadrats/react/components';
import { InlineToolbar } from '@quadrats/react/toolbar';

export interface BaseEmbedElementProps {
  element: EmbedElement;
  haveAlignConfig?: boolean;
  type?: 'input' | 'textarea';
  placeholder?: string;
  hint?: string;
  confirmText?: string;
  onConfirm?: (editor: QuadratsReactEditor, path: Path, value: string) => void;
  children: ReactNode;
}

export const BaseEmbedElementWithoutToolbar = ({
  children,
}: BaseEmbedElementProps) => {
  return (
    <div className="qdr-embed">
      {children}
    </div>
  );
};

const BaseEmbedElement = ({
  element,
  haveAlignConfig = false,
  type = 'input',
  placeholder,
  hint,
  confirmText,
  onConfirm,
  children,
}: BaseEmbedElementProps) => {
  const { openModal } = useModal();
  const locale = useLocale();
  const modalConfigRef = useRef('');
  const editor = useSlateStatic();
  const path = ReactEditor.findPath(editor, element);

  return (
    <div className="qdr-embed">
      <InlineToolbar
        className="qdr-embed__inline-toolbar"
        leftIcons={haveAlignConfig ? [
          {
            icon: AlignLeft,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'left' } as EmbedElement, { at: path });
            },
            active: element.align === 'left' || !element.align,
          },
          {
            icon: AlignCenter,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'center' } as EmbedElement, { at: path });
            },
            active: element.align === 'center',
          },
          {
            icon: AlignRight,
            onClick: () => {
              Transforms.setNodes(editor, { align: 'right' } as EmbedElement, { at: path });
            },
            active: element.align === 'right',
          },
        ] : []}
        rightIcons={[
          {
            icon: Edit,
            onClick: () => {
              openModal({
                title: locale.editor.embedTitle,
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
                confirmText,
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
